import formatPhoneNumber from "@/utility/formatters/formatPhone";
import formatText from "@/utility/formatters/formatText";
import { StudentPrivateInfo } from "@/utility/types";
import React, { SetStateAction } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";

type PrivateSubFormProps = {
    data: StudentPrivateInfo;
    setPrivateFormData: React.Dispatch<SetStateAction<StudentPrivateInfo>>;
};

export default function PrivateSubForm({
    data,
    setPrivateFormData,
}: PrivateSubFormProps) {
    const changeData = (
        person: "Personal" | "Guardian 1" | "Guardian 2",
        field: string,
        value: string
    ) => {
        setPrivateFormData((prev) => {
            return {
                Personal: {
                    ...prev["Personal"],
                },
                "Guardian 1": {
                    ...prev["Guardian 1"],
                },
                "Guardian 2": {
                    ...prev["Guardian 2"],
                },
                [person]: {
                    ...prev[person],
                    [field]: value,
                },
            };
        });
    };
    return (
        <>
            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box flex flex-col">
                <legend className="fieldset-legend">Address</legend>

                <div className="flex flex-col">
                    <label className="fieldset-label">Street Address</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="input"
                            value={formatText(
                                data["Personal"]["Street Address"]
                            )}
                            onChange={(e) =>
                                changeData(
                                    "Personal",
                                    "Street Address",
                                    e.target.value
                                )
                            }
                        />
                        <button
                            type="button"
                            onClick={async () =>
                                navigator.clipboard.writeText(
                                    data["Personal"]["Street Address"]
                                )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            title="Copy to clipboard"
                        >
                            <ClipboardIcon className="w-5 h-5 text-gray-500 hover:text-black" />
                        </button>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <label className="fieldset-label">City</label>
                        <input
                            type="text"
                            className="input"
                            value={formatText(data["Personal"]["City"])}
                            onChange={(e) =>
                                changeData("Personal", "City", e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="fieldset-label">Zip Code</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            className="input"
                            value={data["Personal"]["Zip Code"]}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,5}$/.test(value)) {
                                    changeData("Personal", "Zip Code", value);
                                }
                            }}
                            maxLength={5}
                        />
                    </div>
                </div>
            </fieldset>

            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box flex gap-4">
                <legend className="fieldset-legend">
                    Personal Contact Info
                </legend>

                <div className="flex flex-col">
                    <label className="fieldset-label">Phone</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        className="input"
                        value={formatPhoneNumber(data["Personal"]["Phone"])}
                        onChange={(e) =>
                            changeData("Personal", "Phone", e.target.value)
                        }
                        maxLength={12}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="fieldset-label">Email</label>
                    <input
                        type="email"
                        className="input"
                        value={data["Personal"]["Email"]}
                        onChange={(e) =>
                            changeData("Personal", "Email", e.target.value)
                        }
                    />
                </div>
            </fieldset>

            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">
                    Parent 1 Contact Info
                </legend>

                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <label className="fieldset-label">First Name</label>
                        <input
                            type="text"
                            className="input"
                            value={formatText(data["Guardian 1"]["First Name"])}
                            onChange={(e) =>
                                changeData(
                                    "Guardian 1",
                                    "First Name",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">Last Name</label>
                        <input
                            type="text"
                            className="input"
                            value={formatText(data["Guardian 1"]["Last Name"])}
                            onChange={(e) =>
                                changeData(
                                    "Guardian 1",
                                    "Last Name",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <label className="fieldset-label">Phone</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            className="input"
                            value={formatPhoneNumber(
                                data["Guardian 1"]["Phone"]
                            )}
                            onChange={(e) =>
                                changeData(
                                    "Guardian 1",
                                    "Phone",
                                    e.target.value
                                )
                            }
                            maxLength={12}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">Email</label>
                        <input
                            type="email"
                            className="input"
                            value={data["Guardian 1"]["Email"]}
                            onChange={(e) =>
                                changeData(
                                    "Guardian 1",
                                    "Email",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </div>
            </fieldset>

            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">
                    Parent 2 Contact Info
                </legend>

                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <label className="fieldset-label">First Name</label>
                        <input
                            type="text"
                            className="input"
                            value={formatText(data["Guardian 2"]["First Name"])}
                            onChange={(e) =>
                                changeData(
                                    "Guardian 2",
                                    "First Name",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">Last Name</label>
                        <input
                            type="text"
                            className="input"
                            value={formatText(data["Guardian 2"]["Last Name"])}
                            onChange={(e) =>
                                changeData(
                                    "Guardian 2",
                                    "Last Name",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <label className="fieldset-label">Phone</label>
                        <input
                            type="text"
                            className="input"
                            inputMode="numeric"
                            value={formatPhoneNumber(
                                data["Guardian 2"]["Phone"]
                            )}
                            onChange={(e) =>
                                changeData(
                                    "Guardian 2",
                                    "Phone",
                                    e.target.value
                                )
                            }
                            maxLength={12}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">Email</label>
                        <input
                            type="email"
                            className="input"
                            value={data["Guardian 2"]["Email"]}
                            onChange={(e) =>
                                changeData(
                                    "Guardian 2",
                                    "Email",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </div>
            </fieldset>
        </>
    );
}
