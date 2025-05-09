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

    const copied = false;
    return (
        <>
            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box flex flex-col">
                <legend className="fieldset-legend">Address</legend>

                <div className="flex flex-col">
                    <label className="fieldset-label mb-1">
                        Street Address
                    </label>
                    <div className="w-full max-w-[16rem]">
                        <div className="relative">
                            <label
                                htmlFor="npm-install-copy-button"
                                className="sr-only"
                            >
                                NPM Install
                            </label>
                            <input
                                id="npm-install-copy-button"
                                type="text"
                                value="npm install flowbite"
                                readOnly
                                disabled
                                className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <button
                                onClick={async () =>
                                    await navigator.clipboard.writeText(
                                        data["Personal"]["Street Address"]
                                    )
                                }
                                className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
                                aria-label="Copy to clipboard"
                            >
                                {!copied ? (
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="currentColor"
                                        viewBox="0 0 18 20"
                                    >
                                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500"
                                        fill="none"
                                        viewBox="0 0 16 12"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 5.917 5.724 10.5 15 1.5"
                                        />
                                    </svg>
                                )}
                            </button>
                            <div
                                className={`absolute z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs tooltip dark:bg-gray-700 ${
                                    copied
                                        ? "opacity-100 visible"
                                        : "opacity-0 invisible"
                                }`}
                                style={{
                                    top: "calc(100% + 0.5rem)",
                                    right: "0",
                                }}
                            >
                                {copied ? "Copied!" : "Copy to clipboard"}
                                <div
                                    className="tooltip-arrow"
                                    data-popper-arrow
                                ></div>
                            </div>
                        </div>
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
