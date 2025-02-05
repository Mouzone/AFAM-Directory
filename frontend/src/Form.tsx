import { useState } from "react";
import isoDateToInputDate from "./utility/isoDateToInputDate";

export default function Form({ type, state, onCancel, teachers }) {
    const [formData, setFormData] = useState(state);
	const [isEdit, setIsEdit] = useState(false)
    console.log(formData)
	const onSubmit = (formData) => {
		if (type === "add") {
			fetch("https://us-central1-afam-directory.cloudfunctions.net/createStudent", {
                headers: {
                    "Content-Type": "application/json"
                },
				method: "POST",
				body: JSON.stringify(formData)
			})
		} else {
			fetch("https://us-central1-afam-directory.cloudfunctions.net/editStudent", {
                headers: {
                    "Content-Type": "application/json"
                },
				method: "PUT",
				body: JSON.stringify(formData)
			})
	}
	
		onCancel(); // Hide the form after submission
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
	  		...formData,
	  		[name]: value,
		});
  	};

    const handleTeacherChange = (e) => {
        const teacherName = e.target.value
        const teacherNameList = teacherName.split(" ")
        const firstName = teacherNameList[0]
        const lastName = teacherNameList[1]
        setFormData({
            ...formData,
            teacher: {
                firstName,
                lastName
            }
        })
    }

    const handlePrimaryContactChange = (field) => {
        return (e) => {
            setFormData({
                ...formData,
                primaryContact: {
                    ...formData["primaryContact"],
                    [field]: e.target.value
                }
            })
        }
    }

    const handleHomeChange = (field) => {
        return (e) => {
            setFormData({
                ...formData,
                home: {
                    ...formData["home"],
                    [field]: e.target.value
                }
            })
        }
    }

    const handleSubmit = (e) => {
	    e.preventDefault();
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.schoolYear ||
            !formData.dob ||
            !formData.gender ||
            !formData.highSchool ||
            !formData.phoneNumber ||
            !formData.email 
    // add validation for primaryContact and Teacher
        ) {
            alert("Please fill out all required fields.");
            return;
        }

	const processedData = {
		...formData,
		schoolYear: parseInt(formData.schoolYear, 10),
		dob: new Date(formData.dob),
	}
	    onSubmit(processedData);
    };
  
  const disabled = type==="view" && !isEdit
  return (
	<form
		onSubmit={handleSubmit}
		className="space-y-4 max-h-[80vh] overflow-y-auto p-4"
		noValidate
	>
		<h2 className="text-xl font-bold mb-4">Student Form</h2>

		{/* Grid Layout for Form Fields */}
		<div className="grid grid-cols-2 gap-4">
			{/* First Name */}
			<div className="flex flex-col">
				<label className="font-bold">First Name:</label>
				<input
					type="text"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

			{/* Last Name */}
			<div className="flex flex-col">
				<label className="font-bold">Last Name:</label>
				<input
					type="text"
					name="lastName"
					value={formData.lastName}
					onChange={handleChange}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

			{/* School Year */}
			<div className="flex flex-col">
				<label className="font-bold">School Year:</label>
				<select
					name="schoolYear"
					value={formData.schoolYear}
					onChange={handleChange}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				>
					<option value="">Select</option>
					<option value="9">9</option>
					<option value="10">10</option>
					<option value="11">11</option>
					<option value="12">12</option>
				</select>
			</div>

			{/* Date of Birth */}
			<div className="flex flex-col">
				<label className="font-bold">Date of Birth:</label>
				<input
					type="date"
					name="dob"
					value={isoDateToInputDate(formData.dob)}
					onChange={handleChange}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

			{/* Gender */}
			<div className="flex flex-col">
				<label className="font-bold">Gender:</label>
				<select
					name="gender"
					value={formData.gender}
					onChange={handleChange}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				>
					<option value="">Select</option>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
			    </select>
			</div>

			{/* High School */}
			<div className="flex flex-col">
				<label className="font-bold">High School:</label>
				<input
					type="text"
					name="highSchool"
					value={formData.highSchool}
					onChange={handleChange}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

			{/* Street Address */}
			<div className="flex flex-col">
				<label className="font-bold">Street Address:</label>
				<input
					type="text"
					name="streetAddress"
					value={formData.home.streetAddress}
					onChange={handleHomeChange("streetAddress")}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

            {/* City */}
            <div className="flex flex-col">
				<label className="font-bold">City:</label>
				<input
					type="text"
					name="city"
					value={formData.home.city}
					onChange={handleHomeChange("city")}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

            {/* Zip Code */}
            <div className="flex flex-col">
				<label className="font-bold">Zip Code:</label>
				<input
					type="text"
					name="zipCode"
					value={formData.home.zipCode}
					onChange={handleHomeChange("zipCode")}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

			{/* Phone Number */}
			<div className="flex flex-col">
				<label className="font-bold">Phone Number:</label>
				<input
					type="tel"
					name="phoneNumber"
					value={formData.phoneNumber}
					onChange={handleChange}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

			{/* Email */}
			<div className="flex flex-col">
				<label className="font-bold">Email:</label>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

			{/* Allergies */}
			<div className="flex flex-col">
				<label className="font-bold">Allergies (optional):</label>
				<input
					type="text"
					name="allergies"
					value={formData.allergies}
					onChange={handleChange}
					className="border border-gray-300 rounded p-2"
					disabled={disabled}
				/>
			</div>

			{/* Primary Contact */}
			<div className="flex flex-col">
				<label className="font-bold">Primary Contact First Name:</label>
				<input
					type="text"
					name="primaryContactFirstName"
					value={formData.primaryContact.firstName}
					onChange={handlePrimaryContactChange("firstName")}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

            <div className="flex flex-col">
				<label className="font-bold">Primary Contact Last Name:</label>
				<input
					type="text"
					name="primaryContactLastName"
					value={formData.primaryContact.lastName}
					onChange={handlePrimaryContactChange("lastName")}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

			{/* Primary Contact Phone */}
			<div className="flex flex-col">
				<label className="font-bold">Primary Contact Phone:</label>
				<input
					type="tel"
					name="primaryContactPhone"
					value={formData.primaryContact.phoneNumber}
					onChange={handlePrimaryContactChange("phoneNumber")}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

			{/* Primary Contact Email */}
			<div className="flex flex-col">
				<label className="font-bold">Primary Contact Email:</label>
				<input
					type="email"
					name="primaryContactEmail"
					value={formData.primaryContact.email}
					onChange={handlePrimaryContactChange("email")}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				/>
			</div>

			{/* AFAM Teacher*/}
			<div className="flex flex-col">
				<label className="font-bold">Teacher</label>
				<select
					name="teacher"
					value={`${formData["teacher"]["firstName"]} ${formData["teacher"]["lastName"]}`}
					onChange={handleTeacherChange}
					className="border border-gray-300 rounded p-2"
					required
					disabled={disabled}
				>
					<option value="">Select</option>
					{
						teachers.map(teacher => {
							return <option key={teacher["id"]} value={`${teacher["firstName"]} ${teacher["lastName"]}`}>
								{teacher["firstName"]} {teacher["lastName"]}
							</option>
						})
					}
				</select>
			</div>
		</div>

		<Buttons type={type} isEdit={isEdit} setIsEdit={setIsEdit} onCancel={onCancel}/>
	</form>
  );
}

function Buttons({type, isEdit, setIsEdit, onCancel}) {
    const onClick = (e) => {
        e.preventDefault(); 
        setIsEdit(true)
    }
    
	return (
		<div className="sticky bottom-0 bg-white py-4 flex gap-4">
			{ 
				(type === "add" || isEdit)
				?  (<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					Submit
				</button> )
				: (<button
					type="button"
					onClick={onClick}
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					Edit
				</button> )
			}
			
			<button
				type="button"
				onClick={onCancel}
				className="bg-white border-2 px-3 py-2 rounded hover:bg-gray-300"
			>
				Cancel
			</button>
	  </div>
	)
}