import { createDirectory } from "@/app/utility/cloudFunctions";
import { Directory } from "@/app/utility/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateDirectoryModalProps = { directories: Directory[] };

export default function CreateDirectoryModal({
    directories,
}: CreateDirectoryModalProps) {
    const [directoryName, setDirectoryName] = useState("");
    const [csvFile, setCSVFile] = useState<File | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [directoryNameTaken, setDirectoryNameTaken] = useState(true);
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: createDirectory,
        onSuccess: (response) => {
            // redirect to the new generated uid,
            router.push(`/directory/${response.data.directoryId}`);
        },
        onError: (error) => {
            setError(error);
        },
    });

    return (
        <dialog
            id="CreateDirectoryModal"
            className="modal modal-bottom sm:modal-middle"
        >
            <div className="modal-box flex justify-center">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                </form>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        mutation.mutate({
                            directoryName,
                            csvFile: csvFile ? await csvFile.text() : null,
                        });
                    }}
                >
                    <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box gap-4">
                        <legend className="fieldset-legend">
                            Create New Directory
                        </legend>
                        <div>
                            <legend className="fieldset-legend">
                                Directory Name
                            </legend>
                            <input
                                type="text"
                                placeholder="Directory Name"
                                className="input input-sm"
                                value={directoryName}
                                onChange={(e) => {
                                    setDirectoryName(e.target.value);
                                    setDirectoryNameTaken(
                                        directories.find(
                                            (directory) =>
                                                directory.directoryName ===
                                                e.target.value
                                        ) || e.target.value === ""
                                            ? true
                                            : false
                                    );
                                }}
                            />
                            {directoryNameTaken && (
                                <label className="fieldset-label text-red-400 font-bold">
                                    * Directory name already in use
                                </label>
                            )}
                        </div>

                        <div>
                            <legend className="fieldset-legend">
                                Upload a CSV file
                            </legend>
                            <input
                                type="file"
                                className="file-input-sm file-input"
                                onChange={(e) =>
                                    setCSVFile(e.target?.files?.[0] ?? null)
                                }
                                accept=".csv"
                            />
                        </div>

                        {error && (
                            <p className="text-center bg-red-200 text-red-400 rounded-2xl p-2 my-2">
                                {error?.message}
                            </p>
                        )}
                        <button
                            type="submit"
                            className="btn btn-neutral"
                            disabled={directoryNameTaken}
                            // disabled={error === "Directory name already taken"}
                        >
                            Submit
                        </button>
                    </fieldset>
                </form>
            </div>
        </dialog>
    );
}
