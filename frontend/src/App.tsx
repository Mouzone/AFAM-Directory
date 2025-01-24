import { useState } from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const labels = {
  firstName: "First Name",
  lastName: "Last Name",
  schoolYear: "Grade",
  teacher: "Teacher",
};

function App() {
  const [add, setAdd] = useState(false);
  const [searchValues, setSearchValues] = useState({
	firstName: "",
	lastName: "",
	schoolYear: "",
	teacher: "",
  });

  const { data, error, isLoading } = useSWR(
	"http://localhost:3000/students",
	fetcher
  );

  const onSubmit = (formData) => {
	console.log("Form Data Submitted:", formData);
	setAdd(false); // Hide the form after submission
  };

  if (error) {
	return <div className="text-red-500">Failed to load data.</div>;
  }

  if (isLoading) {
	return <div className="text-blue-500">Loading...</div>;
  }

  const filtered = data.filter((entry) => {
	return (
	  entry["firstName"]
		.toLowerCase()
		.includes(searchValues["firstName"].toLowerCase()) &&
	  entry["lastName"]
		.toLowerCase()
		.includes(searchValues["lastName"].toLowerCase()) &&
	  (!parseInt(searchValues["schoolYear"]) ||
		entry["schoolYear"] === parseInt(searchValues["schoolYear"])) &&
	  entry["afamTeacher"]["firstName"]
		.toLowerCase()
		.includes(searchValues["teacher"].toLowerCase())
	);
  });

  return (
	<div className="p-5 font-sans">
	  {/* Search Inputs */}
	  <div className="p-5 font-sans">
		{/* Search Inputs */}
		<div className="flex gap-4 mb-5 items-center">
			{Object.entries(searchValues).map(([key, value]) => (
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
			))}
			{/* Add Button */}
			<button
			className=" bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
			onClick={() => setAdd(true)}
			>
			Add Student
			</button>
		</div>
		</div>

	  {/* Form Modal */}
	  {add && (
		<div
		className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
		onClick={() => setAdd(false)} // Close modal on outside click
	  >
		<div
		  className="bg-white p-6 rounded-lg w-96"
		  onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
		>
		  <Form onSubmit={onSubmit} onCancel={() => setAdd(false)} />
		</div>
	  </div>
	  )}

	  {/* Table */}
	  <table className="w-full border-collapse">
		<thead>
		  <tr className="bg-gray-200">
			<th className="border border-gray-300 p-2">First Name</th>
			<th className="border border-gray-300 p-2">Last Name</th>
			<th className="border border-gray-300 p-2">School Year</th>
			<th className="border border-gray-300 p-2">Teacher</th>
		  </tr>
		</thead>
		<tbody>
		  {filtered.map((student) => (
			<tr key={student.id} className="hover:bg-gray-100">
			  <td className="border border-gray-300 p-2">{student.firstName}</td>
			  <td className="border border-gray-300 p-2">{student.lastName}</td>
			  <td className="border border-gray-300 p-2">{student.schoolYear}</td>
			  <td className="border border-gray-300 p-2">
				{student.afamTeacher.lastName}, {student.afamTeacher.firstName}
			  </td>
			</tr>
		  ))}
		</tbody>
	  </table>
	</div>
  );
}

function Form({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
	const { name, value } = e.target;
	setFormData({
	  ...formData,
	  [name]: value,
	});
  };

  const handleSubmit = (e) => {
	e.preventDefault();
	if (
	  !formData.firstName ||
	  !formData.lastName ||
	  !formData.schoolYear ||
	  !formData.dob ||
	  !formData.gender ||
	  !formData.highSchool ||
	  !formData.homeAddress ||
	  !formData.phoneNumber ||
	  !formData.email ||
	  !formData.primaryContact ||
	  !formData.primaryContactPhone ||
	  !formData.primaryContactEmail
	) {
	  alert("Please fill out all required fields.");
	  return;
	}
	onSubmit(formData);
  };

  return (
	<form
  onSubmit={handleSubmit}
  className="space-y-4 max-h-[80vh] overflow-y-auto p-4"
>
  <h2 className="text-xl font-bold mb-4">Student Form</h2>

  {/* Form Fields in Grid */}
  <div className="grid grid-cols-2 gap-4">
	{Object.entries(formData).map(([key, value]) => (
	  <div key={key} className="flex flex-col">
		<label className="font-bold">
		  {key.charAt(0).toUpperCase() + key.slice(1)}:
		</label>
		{key === "schoolYear" || key === "gender" ? (
		  <select
			className="border border-gray-300 rounded p-2"
			name={key}
			value={value}
			onChange={handleChange}
			required={key !== "allergies"}
		  >
			<option value="">Select</option>
			{key === "schoolYear" &&
			  [9, 10, 11, 12].map((year) => (
				<option key={year} value={year}>
				  {year}
				</option>
			  ))}
			{key === "gender" &&
			  ["M", "F"].map((gender) => (
				<option key={gender} value={gender}>
				  {gender}
				</option>
			  ))}
		  </select>
		) : key === "dob" ? (
		  <input
			type="date"
			className="border border-gray-300 rounded p-2"
			name={key}
			value={value}
			onChange={handleChange}
			required={key !== "allergies"}
		  />
		) : (
		  <input
			type="text"
			className="border border-gray-300 rounded p-2"
			name={key}
			value={value}
			onChange={handleChange}
			required={key !== "allergies"}
		  />
		)}
	  </div>
	))}
  </div>

  {/* Buttons */}
  <div className="flex gap-4 sticky bottom-0 bg-white py-4">
	<button
	  type="submit"
	  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
	>
	  Submit
	</button>
	<button
	  type="button"
	  onClick={onCancel}
	  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
	>
	  Cancel
	</button>
  </div>
</form>
  );
}

export default App;