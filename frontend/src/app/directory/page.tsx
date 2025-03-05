"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { app, db } from "../../utility/firebase";
import Form from "@/components/DirectoryComponents/Form";
import Table from "@/components/DirectoryComponents/Table";
import { StudentGeneralInfo, Teacher } from "@/types";
import { studentGeneralInfoDefault } from "@/utility/consts";
import {
    collection,
    onSnapshot,
    query,
    getFirestore,
    getDocs,
} from "firebase/firestore";
import Updates from "@/components/DirectoryComponents/Updates";
import Search from "@/components/DirectoryComponents/Search";
import Link from "next/link";
export default function Page() {
    const [user, setUser] = useState<User | null>(null); // Add user state
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
        schoolYear: "",
        teacher: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [updates, setUpdates] = useState<{
        added: string[];
        modified: string[];
        removed: string[];
    }>({ added: [], modified: [], removed: [] });
    const [showUpdates, setShowUpdates] = useState<boolean>(false);

    const closeForm = () => {
        setProfile(studentGeneralInfoDefault);
        setShowForm(false);
    };

    const editForm = (student: StudentGeneralInfo) => {
        setProfile(student);
        setShowForm(true);
    };

    const handleSignOut = async () => {
        const auth = getAuth();
        signOut(auth);
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

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

                if (snapshot.metadata.hasPendingWrites) {
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
                    collection(getFirestore(app), "teachers")
                );
                const teachersSnapshot = await getDocs(teachersQuery);
                const fetchedTeachers: Teacher[] = [];

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

    if (loading) return <div> Loading... </div>;
    if (error) return <div> Error </div>;

    if (!user) return null; // Prevent rendering if not logged in after loading

    const filtered = students.filter((entry: StudentGeneralInfo) => {
        return (
            entry["firstName"]
                .toLowerCase()
                .includes(searchValues["firstName"].toLowerCase()) &&
            entry["lastName"]
                .toLowerCase()
                .includes(searchValues["lastName"].toLowerCase()) &&
            entry["schoolYear"].includes(searchValues["schoolYear"]) &&
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
            <div className="flex justify-center">
                <div>
                    <Link href="/accounts"> Accounts </Link>
                </div>
                <div>
                    <div
                        className={`p-5 font-sans ${
                            showForm ? "max-h-screen overflow-hidden" : ""
                        }`}
                    >
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" // Tailwind styles
                            >
                                Sign Out
                            </button>
                        </div>

                        {/* Search Inputs */}
                        <Search
                            searchValues={searchValues}
                            setSearchValues={setSearchValues}
                            setShowForm={setShowForm}
                        />

                        <Table filtered={filtered} editForm={editForm} />
                    </div>
                </div>
            </div>
            {/* Form Modal */}
            {showForm && (
                <div
                    className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
                    onClick={() => {
                        setShowForm(false);
                        setProfile(studentGeneralInfoDefault);
                    }} // Close modal on outside click
                >
                    <div
                        className="bg-white p-6 rounded-lg w-fit"
                        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
                    >
                        <Form
                            generalState={profile}
                            closeForm={closeForm}
                            teachers={teachers}
                        />
                    </div>
                </div>
            )}
            {/* Popup that details Action: [names] that truncates*/}
            {showUpdates && <Updates updates={updates} />}
        </>
    );
}
