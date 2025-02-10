import { useState } from "react";
import Form from "./Form";
import Table from "./Table"
import { useEffect } from "react";
import { Student, LabelsKey, Teacher } from "./types";
import { addState, labels} from "./utility/consts"
import { collection, onSnapshot, query, getFirestore, getDocs } from "firebase/firestore";
import { app, db } from "./utility/firebase";
import { getAuth, signOut } from "firebase/auth";

function App() {
    const [students, setStudents] = useState<Student[]>([])
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [profile, setProfile] = useState<Student>(addState);
    const [showForm, setShowForm] = useState<boolean>(false)
    const [searchValues, setSearchValues] = useState({
        firstName: "",
        lastName: "",
        schoolYear: "",
        teacher: "",
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<String | null>(null);

    const closeForm = () => {
        setProfile(addState)
		setShowForm(false); 
    }

    const editForm = (student: Student) => {
        setProfile(student)
        setShowForm(true)
    }

    const handleSignOut = async () => { 
        const auth = getAuth()
        signOut(auth)
    }

    useEffect(() => {
        const q = query(collection(db, "students"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedStudents: Student[] = []; 
            snapshot.docChanges().forEach((change) => {
                const student = change.doc.data() as Student; 
                student.id = change.doc.id;

                switch (change.type) {
                    case "added":
                        updatedStudents.push(student);
                        break;
                    case "modified":
                        setStudents((prevStudents) => {
                            const modifiedIndex = prevStudents.findIndex((prevStudent) => prevStudent.id === student.id);
                            if (modifiedIndex !== -1) {
                                const newStudents = [...prevStudents];
                                newStudents[modifiedIndex] = student;
                                return newStudents;
                            }
                            return prevStudents;
                        });
                        break;
                    case "removed":
                        setStudents((prevStudents) => prevStudents.filter((prevStudent) => prevStudent.id !== student.id));
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
                setIsLoading(false);
            }

        }, (error) => {
            console.error("Error listening for updates:", error);
            setError(error.message);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const teachersQuery = query(collection(getFirestore(app), "teachers"));
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

    }, []); 

    if (isLoading) return <div> Loading... </div>
    if (error) return <div> Error </div>

    const filtered = students.filter((entry: Student) => {
        return (
            entry["firstName"]
                .toLowerCase()
                .includes(searchValues["firstName"].toLowerCase()) &&
            entry["lastName"]
                .toLowerCase()
                .includes(searchValues["lastName"].toLowerCase()) &&
            entry["schoolYear"]
                .includes(searchValues["schoolYear"]) &&
            (entry["teacher"]["firstName"]
                .toLowerCase()
                .includes(searchValues["teacher"].toLowerCase()) ||
            entry["teacher"]["lastName"]
                .toLowerCase()
                .includes(searchValues["teacher"].toLowerCase()))
        )
    })

    return (
        <div className="p-5 font-sans">
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
		    <div className="flex gap-4 mb-5 items-center">
			    {
                    Object.entries(searchValues).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                            <label className="font-bold">{labels[key as LabelsKey]}</label>
                            <input
                                className="border border-gray-300 rounded p-2"
                                value={value}
                                onChange={(e) =>
                                    setSearchValues({ ...searchValues, [key]: e.target.value })
                                }
                            />
                        </div>
                    ))
			    }
                {/* Add Button */}
                <button
                    className=" bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setShowForm(true)}
                >
                    Add Student
                </button>
		    </div>

            {/* Form Modal */}
            {
                (showForm) && (
                    <div
                        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
                        onClick={() => {setShowForm(false); setProfile(addState)}} // Close modal on outside click
                    >
                        <div
                            className="bg-white p-6 rounded-lg w-fit"
                            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
                        >
                            <Form 
                                state={profile}
                                closeForm={closeForm}
                                teachers={teachers}
                            />
                        </div>
                    </div>
                )
            }
	        <Table filtered={filtered} editForm={editForm}/>	  
	    </div>
    );
}

export default App;