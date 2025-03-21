import React, { useState, useEffect, useContext, useRef } from "react";
import {
    AttendanceInfoType,
    StudentGeneralInfo,
    StudentPrivateInfo,
    Teacher,
} from "../../types";
import {
    collection,
    doc,
    getDoc,
    updateDoc,
    getDocs,
    setDoc,
    Timestamp,
    addDoc,
} from "firebase/firestore";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { db, storage } from "@/utility/firebase";
import Buttons from "../FormComponents/Buttons";
import {
    labels,
    mandatoryGeneralDataKeys,
    mandatoryPrivateDataKeys,
    studentPrivateInfoDefault,
} from "@/utility/consts";
import General from "../FormComponents/General";
import Private from "../FormComponents/Private";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AuthContext } from "../AuthContext";
import Attendance from "../FormComponents/Attendance";
import { deleteStudent } from "@/utility/cloud-functions";

interface FormProps {
    generalState: StudentGeneralInfo;
    closeForm: () => void;
    teachers: Teacher[];
}

export default function Form({ generalState, closeForm, teachers }: FormProps) {
    const { user } = useContext(AuthContext);
    const [generalData, setGeneralData] =
        useState<StudentGeneralInfo>(generalState);
    const [privateData, setPrivateData] = useState<StudentPrivateInfo>(
        studentPrivateInfoDefault
    );
    const [attendanceData, setAttendanceData] = useState<{
        [key: string]: AttendanceInfoType;
    }>({});
    const prevAttendanceData = useRef<{ [key: string]: AttendanceInfoType }>(
        {}
    );
    const [tab, setTab] = useState<"general" | "attendance" | "private">(
        "general"
    );
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const disabled = "id" in generalData && !isEdit;

    useEffect(() => {
        if (user === false) {
            router.push("/");
        }
    }, [user, router]);

    useEffect(() => {
        if (!generalData["id"]) {
            return;
        }

        async function fetchAttendance() {
            const studentRef = doc(db, "students", generalData["id"] as string);
            const attendanceCollectionRef = collection(
                studentRef,
                "attendance"
            );
            const attendanceDocSnapshot = await getDocs(
                attendanceCollectionRef
            );
            const data: { [key: string]: AttendanceInfoType } = {};
            attendanceDocSnapshot.docs.forEach(
                (doc) => (data[doc.id] = doc.data() as AttendanceInfoType)
            );
            setAttendanceData(data);
            prevAttendanceData.current = data;
        }

        async function fetchPrivateInfo() {
            const studentRef = doc(db, "students", generalData["id"] as string);
            const privateCollectionRef = collection(studentRef, "private");
            const privateDocRef = doc(privateCollectionRef, "privateInfo");
            const privateDocSnapshot = await getDoc(privateDocRef);
            setPrivateData(privateDocSnapshot.data() as StudentPrivateInfo);
        }

        async function fetchHeadshot() {
            const headshotRef = ref(storage, `images/${generalData["id"]}`);
            const url = await getDownloadURL(headshotRef);
            setImageUrl(url);
        }

        fetchHeadshot();
        fetchAttendance();
        fetchPrivateInfo();
    }, [generalData]);

    const onDelete = async () => {
        await deleteStudent({ id: generalData["id"] });
        const imgRef = ref(storage, `images/${generalData["id"]}`);
        deleteObject(imgRef);
        closeForm();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        setImage(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
        setError(null); // Clear any previous errors
    };

    function uploadImage(id: string) {
        if (!image) {
            return;
        }

        const storageRef = ref(storage, `images/${id}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
            },
            (error) => {
                setError(error.message); // Set the error message
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUrl(downloadURL);
                    setImage(null); // Clear the selected image after successful upload
                });
            }
        );
    }

    // runs the same regardless of "add" or "edit" scenario
    const onSubmit = async () => {
        if (generalData["id"] !== undefined) {
            const docRef = doc(db, "students", generalData["id"]);
            const privateDocRef = doc(
                db,
                "students",
                docRef.id,
                "private",
                "privateInfo"
            );

            await updateDoc(docRef, generalData);
            if (
                user &&
                (user.role !== "student" ||
                    (user.role === "student" && generalData["id"]))
            ) {
                await updateDoc(privateDocRef, privateData);
            }
            await updateAttendance(attendanceData);
            uploadImage(docRef.id);
        } else {
            const studentsColRef = collection(db, "students");
            const docRef = await addDoc(studentsColRef, generalData);
            const privateDocRef = doc(
                db,
                "students",
                docRef.id,
                "private",
                "privateInfo"
            );
            if (
                user &&
                (user.role !== "student" ||
                    (user.role === "student" && generalData["id"]))
            ) {
                await updateDoc(privateDocRef, privateData);
            }
            uploadImage(docRef.id);
        }
        closeForm();
    };

    const updateAttendance = async (attendanceData: {
        [key: string]: AttendanceInfoType;
    }) => {
        if (generalData["id"] === undefined) {
            return;
        }
        const id = generalData["id"];
        Object.entries(attendanceData).forEach(async ([date, data]) => {
            const docRef = doc(db, "students", id, "attendance", date);
            if (
                date in prevAttendanceData.current &&
                prevAttendanceData.current[date].sermonAttendance !=
                    data.sermonAttendance &&
                prevAttendanceData.current[date].classAttendance !=
                    data.classAttendance
            ) {
                await updateDoc(docRef, {
                    ...data,
                });
            } else {
                await setDoc(docRef, {
                    ...data,
                    date: Timestamp.fromDate(new Date(date)),
                });
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        for (const key of mandatoryGeneralDataKeys) {
            if (!generalData[key]) {
                alert(`Please fill out ${labels[key]} in General tab`);
                return false;
            }
        }

        if (
            user &&
            (user.role !== "student" ||
                (user.role === "student" && !generalData["id"]))
        ) {
            for (const key of mandatoryPrivateDataKeys) {
                if (!privateData[key]) {
                    alert(`Please fill out ${labels[key]} in Private tab`);
                    return false;
                }
            }
        }

        await onSubmit();
    };

    if (!user) {
        return null;
    }

    const showPrivate =
        !("id" in generalData) ||
        ("id" in generalData && user.role != "student");

    const tabComponents = {
        general: (
            <General
                disabled={disabled}
                teachers={teachers}
                generalData={generalData}
                setGeneralData={setGeneralData}
            />
        ),
        attendance: generalData["id"] ? (
            <Attendance
                disabled={disabled}
                showClassSlider={user.role != "student"}
                attendanceData={attendanceData}
                setAttendanceData={setAttendanceData}
            />
        ) : null,
        private: showPrivate ? (
            <Private
                disabled={disabled}
                privateData={privateData}
                setPrivateData={setPrivateData}
            />
        ) : null,
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg"
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                }
            }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            noValidate
        >
            <h1 className="text-2xl font-bold mb-4">Student Form</h1>
            <div className="flex gap-5">
                <div className="flex flex-col gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={disabled}
                        className={`block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4 file:rounded-md
                            file:border-0 file:text-sm file:font-semibold
                            file:bg-blue-100 file:text-blue-700
                            ${!disabled && "hover:file:bg-blue-100"}`}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}{" "}
                    {/* Display error message */}
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Uploaded Image"
                            height="500"
                            width="300"
                        />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="300"
                            height="300"
                            viewBox="0 0 100 100"
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "5%",
                                background: "#f0f0f0",
                            }}
                        >
                            <circle cx="50" cy="35" r="20" fill="#bbb" />
                            <path
                                d="M50 65c-20 0-35 10-35 35h70c0-25-15-35-35-35z"
                                fill="#bbb"
                            />
                        </svg>
                    )}
                </div>

                <div className="flex flex-col">
                    <div className="flex gap-4 mb-7">
                        <div
                            onClick={() => setTab("general")}
                            className={`cursor-pointer px-4 py-2 rounded-md transition-colors duration-200 ${
                                tab === "general"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            General
                        </div>
                        {showPrivate && (
                            <div
                                onClick={() => setTab("private")}
                                className={`cursor-pointer px-4 py-2 rounded-md transition-colors duration-200 ${
                                    tab === "private"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Private
                            </div>
                        )}
                        {generalData["id"] && (
                            <div
                                onClick={() => setTab("attendance")}
                                className={`cursor-pointer px-4 py-2 rounded-md transition-colors duration-200 ${
                                    tab === "attendance"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Attendance
                            </div>
                        )}
                    </div>
                    {tabComponents[tab]}
                    <Buttons
                        type={!("id" in generalData) ? "add" : "view"}
                        isEdit={isEdit}
                        showDelete={user.role !== "student"}
                        onDelete={onDelete}
                        setIsEdit={setIsEdit}
                        closeForm={closeForm}
                    />
                </div>
            </div>
        </form>
    );
}
