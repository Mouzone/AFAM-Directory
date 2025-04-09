type GeneralSubFormProps = {
    data: {
        firstName: string;
        lastName: string;
        gender: string;
        birthday: string;
        highSchool: string;
        grade: string;
        teacher: string;
    };
    changeData: (field: string, value: string) => void;
};
export default function GeneralSubForm({
    data,
    changeData,
}: GeneralSubFormProps) {
    return (
        <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend">General</legend>

            <div className="flex gap-4">
                <div className="flex flex-col">
                    <label className="fieldset-label">First Name</label>
                    <input
                        type="text"
                        className="input"
                        value={data["firstName"]}
                        onChange={(e) =>
                            changeData("firstName", e.target.value)
                        }
                    />
                </div>
                <div className="flex flex-col">
                    <label className="fieldset-label">Last Name</label>
                    <input
                        type="text"
                        className="input"
                        value={data["lastName"]}
                        onChange={(e) => changeData("lastName", e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex flex-col">
                    <label className="fieldset-label">Gender</label>
                    <select
                        className="select"
                        value={data["gender"]}
                        onChange={(e) => changeData("gender", e.target.value)}
                    >
                        <option>M</option>
                        <option>F</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="fieldset-label">Birthday</label>
                    <input
                        type="date"
                        className="input"
                        value={data["birthday"]}
                        onChange={(e) => changeData("birthday", e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex flex-col">
                    <label className="fieldset-label">High School</label>
                    <input
                        type="text"
                        className="input"
                        value={data["highSchool"]}
                        onChange={(e) =>
                            changeData("highSchool", e.target.value)
                        }
                    />
                </div>
                <div className="flex flex-col">
                    <label className="fieldset-label">Grade</label>
                    <select
                        className="select"
                        value={data["grade"]}
                        onChange={(e) => changeData("grade", e.target.value)}
                    >
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="fieldset-label">
                        Bible Study Teacher
                    </label>
                    <select
                        className="select"
                        value={data["teacher"]}
                        onChange={(e) => changeData("teacher", e.target.value)}
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
                    </select>
                </div>
            </div>
        </fieldset>
    );
}
