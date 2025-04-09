type PrivateSubFormProps = {
    data: {
        personal: {
            streetAddress: string;
            city: string;
            zipCode: string;
            phone: string;
            email: string;
        };
        guardian1: {
            firstName: string;
            lastName: string;
            phone: string;
            email: string;
        };
        guardian2: {
            firstName: string;
            lastName: string;
            phone: string;
            email: string;
        };
    };
    changeData: (
        person: "personal" | "guardian1" | "guardian2",
        field: string,
        value: string
    ) => void;
};
export default function PrivateSubForm({
    data,
    changeData,
}: PrivateSubFormProps) {
    return (
        <>
            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box flex flex-col">
                <legend className="fieldset-legend">Address</legend>

                <div className="flex flex-col">
                    <label className="fieldset-label">Street Address</label>
                    <input
                        type="text"
                        className="input"
                        value={data["personal"]["streetAddress"]}
                        onChange={(e) =>
                            changeData(
                                "personal",
                                "streetAddress",
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <label className="fieldset-label">City</label>
                        <input
                            type="text"
                            className="input"
                            value={data["personal"]["city"]}
                            onChange={(e) =>
                                changeData("personal", "city", e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="fieldset-label">Zip Code</label>
                        <input
                            type="text"
                            className="input"
                            value={data["personal"]["zipCode"]}
                            onChange={(e) =>
                                changeData(
                                    "personal",
                                    "zipCode",
                                    e.target.value
                                )
                            }
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
                        className="input"
                        value={data["personal"]["phone"]}
                        onChange={(e) =>
                            changeData("personal", "phone", e.target.value)
                        }
                    />
                </div>

                <div className="flex flex-col">
                    <label className="fieldset-label">Email</label>
                    <input
                        type="text"
                        className="input"
                        value={data["personal"]["email"]}
                        onChange={(e) =>
                            changeData("personal", "email", e.target.value)
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
                            value={data["guardian1"]["firstName"]}
                            onChange={(e) =>
                                changeData(
                                    "guardian1",
                                    "firstName",
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
                            value={data["guardian1"]["lastName"]}
                            onChange={(e) =>
                                changeData(
                                    "guardian1",
                                    "lastName",
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
                            value={data["guardian1"]["phone"]}
                            onChange={(e) =>
                                changeData("guardian1", "phone", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">Email</label>
                        <input
                            type="text"
                            className="input"
                            value={data["guardian1"]["email"]}
                            onChange={(e) =>
                                changeData("guardian1", "email", e.target.value)
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
                            value={data["guardian2"]["firstName"]}
                            onChange={(e) =>
                                changeData(
                                    "guardian2",
                                    "firstName",
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
                            value={data["guardian2"]["lastName"]}
                            onChange={(e) =>
                                changeData(
                                    "guardian2",
                                    "lastName",
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
                            value={data["guardian2"]["phone"]}
                            onChange={(e) =>
                                changeData("guardian2", "phone", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">Email</label>
                        <input
                            type="text"
                            className="input"
                            value={data["guardian2"]["email"]}
                            onChange={(e) =>
                                changeData("guardian2", "email", e.target.value)
                            }
                        />
                    </div>
                </div>
            </fieldset>
        </>
    );
}
