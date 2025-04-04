import { createDirectory } from "@/utility/cloudFunctions";
import { Directory } from "@/utility/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateDirectoryFormProps = { directories: Directory[] };

export default function CreateDirectoryForm({
    directories,
}: CreateDirectoryFormProps) {
    const [directoryName, setDirectoryName] = useState("");
    const [csvFile, setCSVFile] = useState<File | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [directoryNameError, setDirectoryNameError] = useState<string>("");
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
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                mutation.mutate({
                    directoryName,
                    csvFile: csvFile ? await csvFile.text() : null,
                });
            }}
        >
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
                        value={directoryName}
                        onChange={(e) => {
                            setDirectoryName(e.target.value);
                            if (
                                directories.find(
                                    (directory) =>
                                        directory.directoryName ===
                                        e.target.value
                                )
                            ) {
                                setDirectoryNameError(
                                    "Directory name already in use"
                                );
                            } else if (e.target.value === "") {
                                setDirectoryNameError("Name must be filled");
                            } else if (directoryNameError) {
                                setDirectoryNameError("");
                            }
                        }}
                    />
                </div>

                <div>
                    <legend className="fieldset-legend">
                        Upload a CSV file (Optional)
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
                    <p className="text-center bg-red-300 text-red-600 rounded-xl p-2">
                        {error?.message}
                    </p>
                )}
                {directoryNameError && (
                    <p className="text-center bg-red-300 text-red-600 rounded-xl p-2">
                        {directoryNameError}
                    </p>
                )}
                <button
                    type="submit"
                    className="btn btn-neutral"
                    disabled={directoryNameError !== ""}
                >
                    Submit
                </button>
            </fieldset>
        </form>
    );
}
