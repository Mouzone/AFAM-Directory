import { FormEvent, useEffect, useState } from "react";
import GeneralSubForm from "../SubForms/GeneralSubForm";
import PrivateSubForm from "../SubForms/PrivateSubForm";
import validateCreateStudentForm from "@/utility/validateCreateStudentForm";
import closeModal from "@/utility/closeModal";
import {
    addDoc,
    collection,
    doc,
    setDoc,
    updateDoc,
    writeBatch,
} from "firebase/firestore";
import { db } from "@/utility/firebase";
import { getPrivateData } from "@/utility/getters/getPrivateData";
import { useQuery } from "@tanstack/react-query";
import Tab from "../Tab";
import AttendanceSubForm from "../SubForms/AttendanceSubForm";
import { getAttendanceData } from "@/utility/getters/getAttendanceData";
import { privateFormDataDefault } from "@/utility/consts";
import { getHeadshot } from "@/utility/getters/getHeadshot";

export default function StudentForm({
    studentId,
    generalFormState,
    setDirectory,
    resetState,
}) {
    const [tab, setTab] = useState("general");

    const [generalFormData, setGeneralFormData] = useState(generalFormState);
    const [privateFormData, setPrivateFormData] = useState(
        privateFormDataDefault
    );
    const [attendanceFormData, setAttendanceFormData] = useState({});
    const [headshotURL, setHeadshotURL] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const {
        isLoading: privateIsLoading,
        data: privateData,
        error: privateError,
    } = useQuery({
        queryKey: [studentId, "privateData"],
        queryFn: () => getPrivateData(studentId),
        enabled: studentId !== null,
    });
    const {
        isLoading: attendanceIsLoading,
        data: attendanceData,
        error: attendanceError,
    } = useQuery({
        queryKey: [studentId, "attendanceData"],
        queryFn: () => getAttendanceData(studentId),
        enabled: studentId !== null,
    });

    const {
        isLoading: headshotIsLoading,
        data: headshotData,
        error: headshotError,
    } = useQuery({
        queryKey: [studentId, "headshot"],
        queryFn: () => getHeadshot(studentId),
        enabled: studentId !== null,
    });

    useEffect(() => {
        setGeneralFormData(generalFormState);
    }, [generalFormState]);

    useEffect(() => {
        if (privateData) {
            setPrivateFormData(privateData);
        }
    }, [studentId, privateData]);

    useEffect(() => {
        if (attendanceData) {
            setAttendanceFormData(attendanceData);
        }
    }, [studentId, attendanceData]);

    useEffect(() => {
        if (headshotData) {
            setHeadshotURL(headshotData);
        }
    }, [studentId, headshotData]);

    const exit = () => {
        setTab("general");
        setDate(new Date().toISOString().split("T")[0]);
        resetState();
        closeModal();
    };

    const onSubmit = async (
        studentId: string,
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (studentId) {
            // Edit existing student
            const studentRef = doc(
                db,
                "directory",
                "afam",
                "student",
                studentId
            );
            await Promise.all([
                updateDoc(studentRef, generalFormData),
                updateDoc(doc(studentRef, "private", "data"), privateFormData),
            ]);

            const batch = writeBatch(db);

            // Add each document to the batch
            Object.entries(attendanceFormData).forEach(([date, attendance]) => {
                const docRef = doc(studentRef, "attendance", date);
                batch.set(docRef, attendance);
            });

            await batch.commit();
            setDirectory((prev) => ({
                ...prev,
                [studentId]: generalFormData,
            }));
        } else {
            // Create new student
            const newStudentRef = await addDoc(
                collection(db, "directory", "afam", "student"),
                generalFormData
            );
            await setDoc(
                doc(newStudentRef, "private", "data"),
                privateFormData
            );
            setDirectory((prev) => ({
                ...prev,
                [newStudentRef.id]: generalFormData,
            }));
        }

        exit();
    };

    return (
        <>
            <form method="dialog">
                <button
                    className="btn btn-md btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => exit()}
                >
                    ✕
                </button>
            </form>
            <form onSubmit={(e) => onSubmit(studentId, e)}>
                <div className="tabs tabs-lift">
                    <Tab currTab={tab} value="general" setTab={setTab}>
                        <GeneralSubForm
                            data={generalFormData}
                            setGeneralFormData={setGeneralFormData}
                        />
                    </Tab>
                    <Tab currTab={tab} value="private" setTab={setTab}>
                        <PrivateSubForm
                            data={privateFormData}
                            setPrivateFormData={setPrivateFormData}
                        />
                    </Tab>
                    {studentId && (
                        <Tab currTab={tab} value="attendance" setTab={setTab}>
                            <AttendanceSubForm
                                date={date}
                                setDate={setDate}
                                data={attendanceFormData}
                                setAttendanceFormData={setAttendanceFormData}
                            />
                        </Tab>
                    )}
                </div>
                <div
                    className={`flex justify-end gap-4 mt-4 ${
                        tab === "private" ? "pb-6" : ""
                    }`}
                >
                    <button
                        className="btn btn-neutral"
                        type="submit"
                        disabled={
                            !validateCreateStudentForm(
                                generalFormData,
                                privateFormData
                            )
                        }
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => exit()}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}
