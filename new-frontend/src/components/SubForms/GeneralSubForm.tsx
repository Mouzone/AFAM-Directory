import Image from "next/image";
import React, { SetStateAction } from "react";

type GeneralSubFormProps = {
    data: {
        "First Name": string;
        "Last Name": string;
        Gender: string;
        Birthday: string;
        "High School": string;
        Grade: string;
        Teacher: string;
    };
    setGeneralFormData: React.Dispatch<SetStateAction<any>>;
    headshotURL: string;
    setFile: React.Dispatch<SetStateAction<File | null>>;
};
export default function GeneralSubForm({
    data,
    setGeneralFormData,
    headshotURL,
    setFile,
}: GeneralSubFormProps) {
    const changeData = (field: string, value: string) =>
        setGeneralFormData((prev) => {
            return {
                ...prev,
                [field]: value,
            };
        });
    return (
        <>
            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box flex flex-col">
                <legend className="fieldset-legend">Image</legend>
                <div className="flex justify-center">
                    <input
                        type="file"
                        className="file-input file-input-sm"
                        onChange={(e) => setFile(e.target.files[0])}
                        accept="image/*"
                    />
                </div>

                {headshotURL !== "" && (
                    <Image
                        src={headshotURL}
                        alt="image"
                        width={800}
                        height={500}
                    />
                )}
            </fieldset>
            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">General</legend>

                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <label className="fieldset-label">First Name</label>
                        <input
                            type="text"
                            className="input"
                            value={data["First Name"]}
                            onChange={(e) =>
                                changeData("First Name", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">Last Name</label>
                        <input
                            type="text"
                            className="input"
                            value={data["Last Name"]}
                            onChange={(e) =>
                                changeData("Last Name", e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col flex-1 min-w-[calc(50%-0.5rem)]">
                        <label className="fieldset-label">High School</label>
                        <input
                            type="text"
                            className="input"
                            value={data["High School"]}
                            onChange={(e) =>
                                changeData("High School", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col flex-1 min-w-[calc(50%-0.5rem)]">
                        <label className="fieldset-label">Grade</label>
                        <select
                            className="select"
                            value={data["Grade"]}
                            onChange={(e) =>
                                changeData("Grade", e.target.value)
                            }
                        >
                            <option>9</option>
                            <option>10</option>
                            <option>11</option>
                            <option>12</option>
                        </select>
                    </div>
                    <div className="flex flex-col flex-1 min-w-full">
                        <label className="fieldset-label">
                            Bible Study Teacher
                        </label>
                        <select
                            className="select"
                            value={data["Teacher"]}
                            onChange={(e) =>
                                changeData("Teacher", e.target.value)
                            }
                        >
                            <option>Anna Kwon</option>
                            <option>Chloe Han</option>
                            <option>Diane Song</option>
                            <option>Josephine Lee</option>
                            <option>Joshua Lee</option>
                            <option>JY Kim</option>
                            <option>Karen Park</option>
                            <option>Matt Yoon</option>
                            <option>Rachael Park</option>
                            <option>Shany Park</option>
                            <option>Sol Park</option>
                            <option>None</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <label className="fieldset-label">Gender</label>
                        <select
                            className="select"
                            value={data["Gender"]}
                            onChange={(e) =>
                                changeData("Gender", e.target.value)
                            }
                        >
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="fieldset-label">Birthday</label>
                        <input
                            type="date"
                            className="input"
                            value={data["Birthday"]}
                            onChange={(e) =>
                                changeData("Birthday", e.target.value)
                            }
                        />
                    </div>
                </div>
            </fieldset>
        </>
    );
}
