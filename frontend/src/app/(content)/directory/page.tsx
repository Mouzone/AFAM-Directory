"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { db } from "../../../utility/firebase";
import Form from "@/components/DirectoryComponents/Form";
import Table from "@/components/DirectoryComponents/Table";
import { StudentGeneralInfo, Teacher } from "@/types";
import { studentGeneralInfoDefault } from "@/utility/consts";
import {
    collection,
    onSnapshot,
    query,
    getDocs,
    addDoc,
    setDoc,
    doc,
} from "firebase/firestore";
import Updates from "@/components/DirectoryComponents/Updates";
import Search from "@/components/DirectoryComponents/Search";
import { AuthContext } from "@/components/AuthContext";
import Options from "@/components/DirectoryComponents/Options";

export default function Page() {
    const [loading, setLoading] = useState(true); // Add loading state
    const router = useRouter(); // Initialize useRouter

    const [students, setStudents] = useState<StudentGeneralInfo[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [profile, setProfile] = useState<StudentGeneralInfo>(
        studentGeneralInfoDefault
    );
    const [showForm, setShowForm] = useState<boolean>(false);
    const [searchValues, setSearchValues] = useState({
        firstName: "",
        lastName: "",
        grade: "",
        teacher: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [updates, setUpdates] = useState<{
        added: string[];
        modified: string[];
        removed: string[];
    }>({ added: [], modified: [], removed: [] });
    const [showUpdates, setShowUpdates] = useState<boolean>(false);
    const { user } = useContext(AuthContext);
    const [isMultiSelect, setIsMultiSelect] = useState(false);
    const [multiSelectStudents, setMultiSelectStudents] = useState<Set<string>>(
        new Set()
    );

    const closeForm = () => {
        setProfile(studentGeneralInfoDefault);
        setShowForm(false);
    };

    const editForm = (student: StudentGeneralInfo) => {
        setProfile(student);
        setShowForm(true);
    };

    async function createCollection() {
        if (!user) {
            return;
        }

        const colRef = collection(db, "collections");
        const docRef = await addDoc(colRef, {
            owner: user.uid,
            time: new Date(),
        });

        const studentIds = Array.from(multiSelectStudents); // Convert Set to Array

        const promises = studentIds.map(async (studentId) => {
            const dataRef = doc(
                collection(db, "collections", docRef.id, "data"),
                studentId
            );
            await setDoc(dataRef, { docRef: studentId });
        });

        await Promise.all(promises);
    }

    useEffect(() => {
        if (user === false) {
            router.push("/");
        }
    }, [user, router]);

    useEffect(() => {
        if (!user) return; // Only fetch data if user is authenticated

        const q = query(collection(db, "students"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const updatedStudents: StudentGeneralInfo[] = [];
                const added: string[] = [];
                const modified: string[] = [];
                const removed: string[] = [];
                snapshot.docChanges().forEach((change) => {
                    const student = change.doc.data() as StudentGeneralInfo;
                    student.id = change.doc.id;

                    switch (change.type) {
                        case "added":
                            updatedStudents.push(student);
                            added.push(
                                `${student.firstName} ${student.lastName}`
                            );
                            break;
                        case "modified":
                            setStudents((prevStudents) => {
                                const modifiedIndex = prevStudents.findIndex(
                                    (prevStudent) =>
                                        prevStudent.id === student.id
                                );
                                if (modifiedIndex !== -1) {
                                    const newStudents = [...prevStudents];
                                    newStudents[modifiedIndex] = student;
                                    return newStudents;
                                }
                                return prevStudents;
                            });
                            modified.push(
                                `${student.firstName} ${student.lastName}`
                            );
                            break;
                        case "removed":
                            setStudents((prevStudents) =>
                                prevStudents.filter(
                                    (prevStudent) =>
                                        prevStudent.id !== student.id
                                )
                            );
                            removed.push(
                                `${student.firstName} ${student.lastName}`
                            );
                            break;
                        default:
                            break;
                    }
                });

                if (updatedStudents.length > 0) {
                    setStudents((prevStudents) => {
                        if (prevStudents.length === 0) {
                            return updatedStudents;
                        } else {
                            return [...prevStudents, ...updatedStudents];
                        }
                    });
                    setLoading(false);
                }

                // hasPendingWrites cover local setDoc and updateDoc, but removed is called using cloud function
                if (snapshot.metadata.hasPendingWrites || removed.length) {
                    setUpdates({ added, modified, removed });
                    setShowUpdates(true);
                    setTimeout(() => {
                        setShowUpdates(false);
                        setUpdates({ added: [], modified: [], removed: [] });
                    }, 3000);
                }
            },
            (error) => {
                console.error("Error listening for updates:", error);
                setError(error.message);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, [user]); // Add user dependency

    useEffect(() => {
        if (!user) return; // Only fetch data if user is authenticated
        const fetchTeachers = async () => {
            try {
                const teachersQuery = query(
                    collection(db, "organization/roles", "teacher")
                );
                const teachersSnapshot = await getDocs(teachersQuery);
                const fetchedTeachers: Teacher[] = [
                    {
                        firstName: "Unassigned",
                        lastName: "",
                        id: "",
                    },
                ];
                teachersSnapshot.forEach((doc) => {
                    const teacher = doc.data() as Teacher;
                    teacher.id = doc.id;
                    fetchedTeachers.push(teacher);
                });
                setTeachers(fetchedTeachers);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
                console.error("Error fetching teachers:", err);
            }
        };

        fetchTeachers();
    }, [user]); // Add user dependency

    if (user === null || loading) return <div> Loading... </div>;
    if (!user) return null; // Prevent rendering if not logged in after loading
    if (error) return <div> {error} </div>;

    const filtered = students.filter((entry: StudentGeneralInfo) => {
        return (
            entry["firstName"]
                .toLowerCase()
                .includes(searchValues["firstName"].toLowerCase()) &&
            entry["lastName"]
                .toLowerCase()
                .includes(searchValues["lastName"].toLowerCase()) &&
            entry["grade"].includes(searchValues["grade"]) &&
            (entry["teacher"]["firstName"]
                .toLowerCase()
                .includes(searchValues["teacher"].toLowerCase()) ||
                entry["teacher"]["lastName"]
                    .toLowerCase()
                    .includes(searchValues["teacher"].toLowerCase()))
        );
    });

    return (
        <>
            <div>
                <div
                    className={`pt-0 p-5 font-sans ${
                        showForm ? "max-h-screen overflow-hidden" : ""
                    }`}
                >
                    {/* Search Inputs */}
                    <div className="flex gap-4 mb-5 items-center">
                        <Search
                            searchValues={searchValues}
                            setSearchValues={setSearchValues}
                        />
                        {/* Add Button */}
                        <Options
                            setIsMultiSelect={setIsMultiSelect}
                            setShowForm={setShowForm}
                        />
                    </div>

                    <Table
                        filtered={filtered}
                        editForm={editForm}
                        isMultiSelect={isMultiSelect}
                        setIsMultiSelect={setIsMultiSelect}
                        multiSelectStudents={multiSelectStudents}
                        setMultiSelectStudents={setMultiSelectStudents}
                        createCollection={createCollection}
                    />
                </div>
            </div>
            {/* Form Modal */}
            {showForm && (
                <div
                    className="fixed inset-0 bg-opacity-50 backdrop-blur-lg flex justify-center items-center"
                    onClick={() => {
                        setShowForm(false);
                        setProfile(studentGeneralInfoDefault);
                    }} // Close modal on outside click
                >
                    <Form
                        generalState={profile}
                        closeForm={closeForm}
                        teachers={teachers}
                    />
                </div>
            )}
            {/* Popup that details Action: [names] that truncates*/}
            {showUpdates && <Updates updates={updates} />}
        </>
    );
}
