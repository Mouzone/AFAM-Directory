import React, { SetStateAction } from "react";
import { LabelsKey, SearchValues } from "../../types";
import { labels } from "../../utility/consts";


interface SearchProps {
    searchValues: SearchValues,
    setSearchValues: React.Dispatch<SetStateAction<SearchValues>>,
    setShowForm: React.Dispatch<SetStateAction<boolean>>
}

export default function Search({searchValues, setSearchValues, setShowForm,}: SearchProps) {
    return (
        <div className="flex gap-4 mb-5 items-center">
            {Object.entries(searchValues).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                    <label className="font-bold">
                        {labels[key as LabelsKey]}
                    </label>
                    <input
                        className="border border-gray-300 rounded p-2"
                        value={value}
                        onChange={(e) =>
                            setSearchValues({
                                ...searchValues,
                                [key]: e.target.value,
                            })
                        }
                    />
                </div>
            ))}
            {/* Add Button */}
            <button
                className=" bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setShowForm(true)}
            >
                Add Student
            </button>
        </div>
    );
}
