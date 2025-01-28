import { useState } from "react";
import useSWR from "swr";
import Form from "./Form";
import Table from "./Table"

const fetcher = (...args) => fetch(...args).then((res) => res.json());
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
  const [add, setAdd] = useState(false);
  const [profile, setProfile] = useState<object | null>(null);
  const [searchValues, setSearchValues] = useState({
	firstName: "",
	lastName: "",
	schoolYear: "",
	teacher: "",
  });

  const { data: students, error: studentsError, isLoading: studentsIsLoading } = useSWR(
	"http://localhost:3000/students",
	fetcher
  );

  const { data: teachers, error: teachersError, isLoading: teachersIsLoading } = useSWR(
	"http://localhost:3000/teachers",
	fetcher
  );

  if (studentsError || teachersError) {
	return <div className="text-red-500">Failed to load data.</div>;
  }

  if (studentsIsLoading || teachersIsLoading) {
	return <div className="text-blue-500">Loading...</div>;
  }

  const teachersMap = {}
  teachers.forEach(teacher => {
    teachersMap[teacher["id"]] = {
        firstName: teacher["firstName"], 
        lastName: teacher["lastName"]
    }
  })

  students.forEach(student => {
    student["afamTeacher"] = teachersMap[student["afamTeacherId"]]
  })

  const filtered = students.filter((entry) => {
	return (
		entry["firstName"]
			.toLowerCase()
			.includes(searchValues["firstName"].toLowerCase()) &&
		entry["lastName"]
			.toLowerCase()
			.includes(searchValues["lastName"].toLowerCase()) &&
		(!parseInt(searchValues["schoolYear"]) ||
			entry["schoolYear"] === parseInt(searchValues["schoolYear"])) &&
		(entry["afamTeacher"]["firstName"]
			.toLowerCase()
			.includes(searchValues["teacher"].toLowerCase()) ||
		entry["afamTeacher"]["lastName"]
			.toLowerCase()
			.includes(searchValues["teacher"].toLowerCase()))
	);
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
				onClick={() => setProfile(false)} // Close modal on outside click
			>
				<div
					className="bg-white p-6 rounded-lg w-fit"
					onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
				>
					<Form 
						type={add ? "add" : "view"} 
						state={add ? addState : profile}
						onCancel={add ? () => setAdd(false) : () => setProfile(null)} />
				</div>
			</div>
		)
	  }
	  <Table filtered={filtered} setProfile={setProfile}/>	  
	</div>
  );
}

export default App;