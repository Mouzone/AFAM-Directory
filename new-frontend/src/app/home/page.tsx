"use client";

import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../components/Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utility/firebase";
import CreateDirectoryModal from "../components/Modals/CreateDirectoryModal";

const getStudents = async (selectedDirectory: string) => {
    const studentDocs = await getDocs(
        collection(db, "directories", selectedDirectory, "students")
    );
    return studentDocs.docs.map((studentDoc) => {
        return { ...studentDoc.data(), id: studentDoc.id };
    });
};

export default function Page() {
    const { user, directories } = useContext(AuthContext);
    const [input, setInput] = useState("");
    const [selectedDirectory, setSelectedDirectory] = useState<string>(""); // this will be the id of the directgory
    const [showCreateDirectoryModal, setShowCreateDirectoryModal] =
        useState(false);
    // get students from first directory of the list
    // on directory change refetch students
    const {
        isLoading,
        data: students,
        error,
    } = useQuery({
        queryKey: [selectedDirectory, "students"],
        queryFn: () => getStudents(selectedDirectory),
    });

    if (!user) {
        return <></>;
    }

    // onSubmit handles typing input
    // options onClick handles clicking and selecting option
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const foundDirectory = directories.find(
            (directory) => directory.name === input
        );
        if (foundDirectory) {
            setSelectedDirectory(foundDirectory.id);
        }
    };

    return (
        <>
            {showCreateDirectoryModal && <CreateDirectoryModal />}
            <form
                onSubmit={onSubmit}
                className="flex w-screen h-screen items-center justify-center"
            >
                <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                    <input
                        type="text"
                        className="input"
                        list="directories"
                        placeholder="Navigate to..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <datalist id="directories">
                        {directories.map((directory) => (
                            <option
                                key={directory.id}
                                value={directory.id}
                                onClick={() => {
                                    setInput(directory.name);
                                    setSelectedDirectory(directory.id);
                                }}
                            >
                                {directory.name}
                            </option>
                        ))}
                    </datalist>
                    <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <span className="flex-shrink mx-4">or</span>
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-soft"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowCreateDirectoryModal(true);
                        }}
                    >
                        Create New
                    </button>
                </fieldset>
            </form>
        </>
    );
}
