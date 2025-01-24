import { useState } from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Form({ onSubmit, onCancel }) {
    const { data, isError, isLoading } = useSWR("http://localhost:3000/teachers", fetcher) 
    
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
    className="space-y-10 max-h-[80vh] overflow-y-auto p-4"
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