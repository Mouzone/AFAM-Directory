import { useState } from "react";
import Form from "./Form";
import Table from "./Table"
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Student, LabelsKey, Teacher } from "./types";
import { addState, labels} from "./utility/consts"
import { getFunctions, httpsCallable } from "firebase/functions"

function App() {
    const { token } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate("/", { replace: true})
        }
    }, [token, navigate])

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

    const closeForm = () => {
        setProfile(addState)
		setShowForm(false); 
    }

    const editForm = (student: Student) => {
        setProfile(student)
        setShowForm(true)
    }

    useEffect(() => {
        const functions = getFunctions()
        const getStudents = httpsCallable(functions, "getStudents")
        const getTeachers = httpsCallable(functions, "getTeachers")
        getStudents()
            .then((result) => {
                setStudents(result.data.students)
            })
    
        getTeachers()
            .then((result) => {
                setTeachers(result.data.teachers)
            })  
    }, [])
    
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