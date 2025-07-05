import AllergyInput from "@/components/Inputs/AllergyInput";
import MandatoryIndicator from "@/components/Minor/MandatoryIndicator";
import formatText from "@/utility/formatters/formatText";
import { StudentGeneralInfo } from "@/utility/types";
import Image from "next/image";
import React, { RefObject, SetStateAction } from "react";

type GeneralSubFormProps = {
    data: StudentGeneralInfo;
    setGeneralFormData: React.Dispatch<SetStateAction<StudentGeneralInfo>>;
    setFile: React.Dispatch<SetStateAction<File | null>>;
    fileInputRef: RefObject<null | HTMLInputElement>;
    resetCounter: number;
};
export default function GeneralSubForm({
    data,
    setGeneralFormData,
    setFile,
    fileInputRef,
    resetCounter,
}: GeneralSubFormProps) {
    const currentYear = new Date().getFullYear();
    const years = []
    for (let i = 0; i < 5; i++) {
        years.push(currentYear - i);
    }
    const changeData = (field: keyof StudentGeneralInfo, value: string | number | boolean) =>
        {console.log(field, value);
        setGeneralFormData((prev) => {
            return {
                ...prev,
                [field]: value,
            };
        });
    }
    
    return (
        <>
            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box flex flex-col">
                <legend className="fieldset-legend">Image</legend>
                <div className="flex justify-center">
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="file-input file-input-sm"
                        onChange={(e) => {
                            const file = e.target?.files?.[0];
                            if (file) {
                                setFile(file);
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    const url = event.target?.result ?? "";
                                    changeData("Headshot URL", url as string);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                        accept="image/*"
                    />
                </div>

                {data["Headshot URL"] !== "" && (
                    <Image
                        src={data["Headshot URL"]}
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
                        <label className="fieldset-label">
                            First Name
                            <MandatoryIndicator/>
                        </label>
                        <input
                            type="text"
                            className="input"
                            value={formatText(data["First Name"])}
                            onChange={(e) =>
                                changeData("First Name", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">
                            Last Name
                            <MandatoryIndicator/>
                        </label>
                        <input
                            type="text"
                            className="input"
                            value={formatText(data["Last Name"])}
                            onChange={(e) =>
                                changeData("Last Name", e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col flex-1 min-w-[calc(50%-0.5rem)]">
                        <label className="fieldset-label">
                            High School
                            <MandatoryIndicator/>
                        </label>
                        <input
                            type="text"
                            className="input"
                            value={formatText(data["High School"])}
                            onChange={(e) =>
                                changeData("High School", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col flex-1 min-w-[calc(50%-0.5rem)]">
                        <label className="fieldset-label">
                            Grade
                            <MandatoryIndicator/>
                        </label>
                        <select
                            className="select"
                            value={String(data["Grade"])}
                            onChange={(e) =>
                                changeData("Grade", parseInt(e.target.value))
                            }
                        >
                            <option value={9}>9</option>
                            <option value={10}>10</option>
                            <option value={11}>11</option>
                            <option value={12}>12</option>
                        </select>
                    </div>
                    <div className="flex flex-col flex-1 min-w-full">
                        <label className="fieldset-label">
                            Bible Study Teacher (if assigned)
                            <MandatoryIndicator/>
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
                        <label className="fieldset-label">
                            Gender
                            <MandatoryIndicator/>
                        </label>
                        <select
                            className="select"
                            value={data["Gender"]}
                            onChange={(e) =>
                                changeData("Gender", e.target.value)
                            }
                        >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="fieldset-label">
                            Birthday
                            <MandatoryIndicator/>
                        </label>
                        <input
                            type="date"
                            className="input"
                            value={data["Birthday"]}
                            onChange={(e) =>
                                changeData("Birthday", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">
                            First time AFAM?
                            <MandatoryIndicator/>
                        </label>
                        <select 
                            value={data["First Time"] ? "Yes" : "No"}
                            onChange={(e) => {
                                changeData("First Time", e.target.value === "Yes");
                            }
                                
                            }
                            className="select"
                        >
                            
                            <option  value={"Yes"}>
                                Yes
                            </option>
                            <option value={"No"}>
                                No
                            </option>
                        </select>
                    </div>
                </div>
                <AllergyInput
                    allergies={data["Allergies"]}
                    setAllergies={(allergy: string[]) =>
                        setGeneralFormData((prev) => {
                            return {
                                ...prev,
                                Allergies: allergy,
                            };
                        })
                    }
                    resetCounter={resetCounter}
                />
            </fieldset>
        </>
    );
}
