import { FormEvent, useEffect, useRef, useState } from "react";
import GeneralSubForm from "../SubForms/StudentSubForms/GeneralSubForm";
import PrivateSubForm from "../SubForms/StudentSubForms/PrivateSubForm";
import validateCreateStudentForm from "@/utility/validateCreateStudentForm";
import closeModal from "@/utility/closeModal";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    writeBatch,
} from "firebase/firestore";
import { db, storage } from "@/utility/firebase";
import Tab from "../Tab";
import AttendanceSubForm from "../SubForms/StudentSubForms/AttendanceSubForm";
import {
    generalFormDataDefault,
    privateFormDataDefault,
} from "@/utility/consts";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
    Attendance,
    AttendanceObject,
    StudentGeneralInfo,
    StudentPrivateInfo,
} from "@/utility/types";

type StudentFormProps = {
    generalFormState: StudentGeneralInfo;
    showPrivate: boolean;
};
export default function StudentForm({
    generalFormState,
    showPrivate,
}: StudentFormProps) {
    const [tab, setTab] = useState("general");

    const [generalFormData, setGeneralFormData] = useState(generalFormState);
    const [privateFormData, setPrivateFormData] = useState<StudentPrivateInfo>(
        privateFormDataDefault
    );
    const [attendanceFormData, setAttendanceFormData] =
        useState<AttendanceObject>({});
    const [file, setFile] = useState<File | null>(null);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const studentId = generalFormState["Id"];

    useEffect(() => {
        setGeneralFormData(generalFormState);
    }, [generalFormState]);

    useEffect(() => {
        const getPrivate = async () => {
            const privateDocRef = doc(
                db,
                "directory",
                "afam",
                "student",
                studentId,
                "private",
                "data"
            );
            const privateDoc = await getDoc(privateDocRef);
            setPrivateFormData(privateDoc.data() as StudentPrivateInfo);
        };
        const getAttendance = async () => {
            const attendanceColRef = collection(
                db,
                "directory",
                "afam",
                "student",
                studentId,
                "attendance"
            );
            const attendanceDocs = await getDocs(attendanceColRef);
            const attendanceData: AttendanceObject = {};
            for (const attendanceDoc of attendanceDocs.docs) {
                attendanceData[attendanceDoc.id] =
                    attendanceDoc.data() as Attendance;
            }
            setAttendanceFormData(attendanceData);
        };

        if (studentId != "") {
            getPrivate();
            getAttendance();
        } else {
            setPrivateFormData(privateFormDataDefault);
        }
    }, [studentId]);

    const exit = () => {
        closeModal();
        setDate(new Date().toISOString().split("T")[0]);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // This clears the selected file
        }
        setFile(null);
        setTab("general");
    };

    const onSubmit = async (
        studentId: string,
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (studentId !== "") {
            // Edit existing student
            const studentRef = doc(
                db,
                "directory",
                "afam",
                "student",
                studentId
            );

            if (file) {
                const storageRef = ref(storage, `images/${studentId}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Track upload progress (optional)
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100;
                        console.log(`Upload progress: ${progress}%`);
                    },
                    (error) => {
                        console.error("Upload failed:", error);
                    },
                    async () => {
                        // Upload completed: Get the public URL
                        const downloadURL = await getDownloadURL(
                            uploadTask.snapshot.ref
                        );

                        // Store the URL in your form data
                        generalFormData["Headshot URL"] = downloadURL;
                    }
                );
            }

            const promises = [updateDoc(studentRef, generalFormData)];

            // conditionally set private data, if edit mode and no private, will overwrite all private fields to ""
            if (showPrivate) {
                promises.push(
                    updateDoc(
                        doc(studentRef, "private", "data"),
                        privateFormData
                    )
                );
            }

            await Promise.all([promises]);

            const batch = writeBatch(db);

            // Add each document to the batch
            Object.entries(attendanceFormData).forEach(([date, attendance]) => {
                const docRef = doc(studentRef, "attendance", date);
                batch.set(docRef, attendance);
            });

            await batch.commit();
        } else {
            // Create new student

            const newStudentRef = await addDoc(
                collection(db, "directory", "afam", "student"),
                generalFormData
            );
            await updateDoc(newStudentRef, { Id: newStudentRef.id });
            await setDoc(
                doc(newStudentRef, "private", "data"),
                privateFormData
            );

            if (file) {
                const storageRef = ref(storage, `images/${newStudentRef.id}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Track upload progress (optional)
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100;
                        console.log(`Upload progress: ${progress}%`);
                    },
                    (error) => {
                        console.error("Upload failed:", error);
                    },
                    async () => {
                        // Upload completed: Get the public URL
                        const downloadURL = await getDownloadURL(
                            uploadTask.snapshot.ref
                        );

                        // Store the URL in your form data
                        generalFormData["Headshot URL"] = downloadURL;
                        await updateDoc(newStudentRef, {
                            "Headshot URL": downloadURL,
                        });
                    }
                );
            }
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
                            setFile={setFile}
                            fileInputRef={fileInputRef}
                        />
                    </Tab>
                    {(studentId === "" || showPrivate) && (
                        <Tab currTab={tab} value="private" setTab={setTab}>
                            <PrivateSubForm
                                data={privateFormData}
                                setPrivateFormData={setPrivateFormData}
                            />
                        </Tab>
                    )}
                    {studentId !== "" && (
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
                        tab !== "attendance" ? "pb-6" : ""
                    }`}
                >
                    <button
                        className="btn btn-neutral dark:btn-secondary"
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
                        className="btn dark:btn-accent"
                        onClick={() => exit()}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}
