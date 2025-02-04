import { useState } from "react";
import useSWR from "swr";
import Form from "./Form";
import Table from "./Table"
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const fetcher = ([url, token]) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json());
const addState = {
    firstName: "",
    lastName: "",
    schoolYear: "",
    dob: "",
    gender: "",
    highSchool: "",
    homeAddress: "",
    phoneNumber: "",
    email: "",
    allergies: "",
    primaryContact: "",
    primaryContactPhone: "",
    primaryContactEmail: "",
    afamTeacherId: ""
}

const labels = {
    firstName: "First Name",
    lastName: "Last Name",
    schoolYear: "Grade",
    teacher: "Teacher",
};

function App() {
    const { user, token} = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate("/", { replace: true})
        }
    }, [token, navigate])

    const [add, setAdd] = useState(false);
    const [profile, setProfile] = useState<object | null>(null);
    const [searchValues, setSearchValues] = useState({
        firstName: "",
        lastName: "",
        schoolYear: "",
        teacher: "",
    });

    const { data: students, error: studentsError, isLoading: studentsIsLoading } = useSWR(
        ["https://us-central1-afam-directory.cloudfunctions.net/getCollection?type=students", token],
        fetcher
    );

    const { data: teachers, error: teachersError, isLoading: teachersIsLoading } = useSWR(
        ["https://us-central1-afam-directory.cloudfunctions.net/getCollection?type=teachers", token],
        fetcher
    );

    console.log(students)
    console.log(teachers)
    if (studentsError || teachersError) {
        return <div className="text-red-500">Failed to load data.</div>;
    }

    if (studentsIsLoading || teachersIsLoading) {
        return <div className="text-blue-500">Loading...</div>;
    }


    const filtered = students.filter((entry) => {
        console.log(entry)
        return (
            entry["firstName"]
                .toLowerCase()
                .includes(searchValues["firstName"].toLowerCase()) &&
            entry["lastName"]
                .toLowerCase()
                .includes(searchValues["lastName"].toLowerCase()) &&
            (!parseInt(searchValues["schoolYear"]) ||
                entry["schoolYear"] === parseInt(searchValues["schoolYear"])) &&
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
                            <label className="font-bold">{labels[key]}</label>
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
                    onClick={() => setAdd(true)}
                >
                    Add Student
                </button>
		    </div>

            {/* Form Modal */}
            {
                (add || profile) && (
                    <div
                        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
                        onClick={() => setProfile(null)} // Close modal on outside click
                    >
                        <div
                            className="bg-white p-6 rounded-lg w-fit"
                            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
                        >
                            <Form 
                                type={add ? "add" : "view"} 
                                state={add ? addState : profile}
                                onCancel={add ? () => setAdd(false) : () => setProfile(null)} 
                                teachers={teachers}
                            />
                        </div>
                    </div>
                )
            }
	        <Table filtered={filtered} teachers={teachers} setProfile={setProfile}/>	  
	    </div>
    );
}

export default App;