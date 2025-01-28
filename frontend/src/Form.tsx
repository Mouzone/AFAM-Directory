import { useState } from "react";
import useSWR from "swr";
import isoDateToInputDate from "./utility/isoDateToInputDate";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Form({ type, state, onCancel }) {
  const [formData, setFormData] = useState(state);
  const {data, error, isLoading} = useSWR("http://localhost:3000/teachers", fetcher)

  const onSubmit = (formData) => {
	fetch("http://localhost:3000/students", {
		method: "POST",
		body: JSON.stringify(formData)
	})
	onCancel(); // Hide the form after submission
  };

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
      !formData.primaryContactEmail ||
      !formData.afamTeacherId
    ) {
      alert("Please fill out all required fields.");
      return;
    }
    const processedData = {
        ...formData,
        schoolYear: parseInt(formData.schoolYear, 10),
        dob: new Date(formData.dob),
        afamTeacherId: parseInt(formData.afamTeacherId, 10)
    }
    onSubmit(processedData);
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto p-4"
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
            disabled={type==="view"}
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
            disabled={type==="view"}
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
            disabled={type==="view"}
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
            disabled={type==="view"}
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
            disabled={type==="view"}
          >
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
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
            disabled={type==="view"}
          />
        </div>

        {/* Home Address */}
        <div className="flex flex-col">
          <label className="font-bold">Home Address:</label>
          <input
            type="text"
            name="homeAddress"
            value={formData.homeAddress}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
            required
            disabled={type==="view"}
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
            disabled={type==="view"}
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
            disabled={type==="view"}
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
            disabled={type==="view"}
          />
        </div>

        {/* Primary Contact */}
        <div className="flex flex-col">
          <label className="font-bold">Primary Contact:</label>
          <input
            type="text"
            name="primaryContact"
            value={formData.primaryContact}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
            required
            disabled={type==="view"}
          />
        </div>

        {/* Primary Contact Phone */}
        <div className="flex flex-col">
          <label className="font-bold">Primary Contact Phone:</label>
          <input
            type="tel"
            name="primaryContactPhone"
            value={formData.primaryContactPhone}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
            required
            disabled={type==="view"}
          />
        </div>

        {/* Primary Contact Email */}
        <div className="flex flex-col">
          <label className="font-bold">Primary Contact Email:</label>
          <input
            type="email"
            name="primaryContactEmail"
            value={formData.primaryContactEmail}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
            required
            disabled={type==="view"}
          />
        </div>
        <div className="flex flex-col">
        <label className="font-bold">Teacher</label>
        <select
          name="afamTeacherId"
          value={formData.afamTeacherId}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2"
          required
          disabled={type==="view"}
        >
          <option value="">Select</option>
          {
            !error && !isLoading && data.map(entry => {
                return <option value={entry["id"]}>
                    {entry["firstName"]} {entry["lastName"]}
                </option>
            })
          }
        </select>
      </div>
      </div>

      
          <Buttons onCancel={onCancel}/>
    </form>
  );
}

function Buttons({onCancel}) {
    return (
        <div className="sticky bottom-0 bg-white py-4">
            <div className="flex gap-4">
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
      </div>
    )
}