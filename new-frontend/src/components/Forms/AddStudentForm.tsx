export default function AddStudentForm() {
    return (
        <form>
            <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">
                    Create New Directory
                </legend>
                <div>
                    <legend className="fieldset-legend">Directory Name</legend>
                    <input
                        type="text"
                        placeholder="Directory Name"
                        className="input input-sm"
                        // value={directoryName}
                        onChange={(e) => {}}
                    />
                </div>

                <div>
                    <legend className="fieldset-legend">
                        Upload a CSV file (Optional)
                    </legend>
                    <input
                        type="file"
                        className="file-input-sm file-input"
                        onChange={(e) => {}}
                        accept=".csv"
                    />
                </div>
                {/* {error && (
                    <p className="text-center bg-red-300 text-red-600 rounded-xl p-2">
                        {error?.message}
                    </p>
                )} */}
                <button type="submit" className="btn btn-neutral">
                    Submit
                </button>
            </fieldset>
        </form>
    );
}
