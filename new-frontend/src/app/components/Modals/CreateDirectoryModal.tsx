import { useState } from "react";

export default function CreateDirectoryModal() {
    const [directoryName, setDirectoryName] = useState("");
    const [csvFile, setCSVFile] = useState<File | null>(null);

    const onSubmit = async () => {};

    return (
        <form onSubmit={onSubmit}>
            <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box gap-4">
                <legend className="fieldset-legend">
                    Create New Directory
                </legend>
                <input
                    type="text"
                    placeholder="Directory Name"
                    className="input input-sm"
                    value={directoryName}
                    onChange={(e) => setDirectoryName(e.target.value)}
                />
                <input
                    type="file"
                    className="file-input-sm file-input"
                    onChange={(e) => setCSVFile(e.target?.files?.[0] ?? null)}
                />
                <button type="submit" className="btn btn-neutral">
                    Submit
                </button>
            </fieldset>
        </form>
    );
}
