export default function GeneralSubForm() {
    return (
        <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend">General</legend>

            <div className="flex">
                <div className="flex flex-col">
                    <label className="fieldset-label">First Name</label>
                    <input type="text" className="input" />
                </div>
                <div className="flex flex-col">
                    <label className="fieldset-label">Last Name</label>
                    <input type="text" className="input" />
                </div>
                <div className="flex flex-col">
                    <label className="fieldset-label">Gender</label>
                    <select className="select">
                        <option>M</option>
                        <option>F</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="fieldset-label">Birthday</label>
                    <input type="date" className="input" />
                </div>
            </div>
            <div className="flex">
                <div className="flex flex-col">
                    <label className="fieldset-label">High School</label>
                    <input type="text" className="input" />
                </div>
                <div className="flex flex-col">
                    <label className="fieldset-label">Grade</label>
                    <select className="select">
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
                    <select className="select">
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
