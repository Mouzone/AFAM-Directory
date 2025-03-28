import React, { SetStateAction } from "react";
import { LabelsKey, SearchValues } from "../../types";
import { labels } from "../../utility/consts";

interface SearchProps {
    searchValues: SearchValues;
    setSearchValues: React.Dispatch<SetStateAction<SearchValues>>;
}

export default function Search({ searchValues, setSearchValues }: SearchProps) {
    return (
        <>
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
        </>
    );
}
