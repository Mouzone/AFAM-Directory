import { useMutation } from "@tanstack/react-query";
import { addDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateDirectoryInput = {
    directoryName: string;
    csvFile: File | null;
};
const createDirectory = ({ directoryName, csvFile }: CreateDirectoryInput) => {
    if (!csvFile) {
        // create document Firestore style
        const docId = addDoc();
    } else {
        // send to cloud function to parse csvFile, then create directory and upload all the data
    }
};

export default function CreateDirectoryModal() {
    const [directoryName, setDirectoryName] = useState("");
    const [csvFile, setCSVFile] = useState<File | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: createDirectory,
        onSuccess: (data) => {
            // redirect to the new generated uid,
            router.push(`/directory/${data.directoryId}`);
        },
        onError: (error) => {
            setError(error);
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate({ directoryName, csvFile });
            }}
        >
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
                {error && (
                    <p className="text-center bg-red-200 text-red-400 rounded-2xl p-2 my-2">
                        {error?.message}
                    </p>
                )}
                <button type="submit" className="btn btn-neutral">
                    Submit
                </button>
            </fieldset>
        </form>
    );
}
