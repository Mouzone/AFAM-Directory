"use client";

import { FormEvent, useState } from "react";
import { Directory } from "../utility/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
// import Modal from "../../components/Modal";
// import CreateDirectoryForm from "@/components/Forms/CreateDirectoryForm";
type DirectoryNavigationProps = {
    directories: Directory[];
    router: AppRouterInstance;
};
export default function DirectoryNavigation({
    directories,
    router,
}: DirectoryNavigationProps) {
    const [selectedDirectory, setSelectedDirectory] =
        useState<Directory | null>(null); // this will be the id of the directory

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // set error if there is no selectedDirectory
        if (selectedDirectory) {
            router.push(`/directory/${selectedDirectory.id}`);
        }
    };

    return (
        <>
            {/* <Modal>
                <CreateDirectoryForm directories={directories} />
            </Modal> */}
            <form
                onSubmit={onSubmit}
                className="flex h-full items-center justify-center"
            >
                <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                    <div className="flex gap-4">
                        <select
                            defaultValue="Select a Directory"
                            className="select select-sm"
                            value={selectedDirectory?.name}
                            onChange={(e) =>
                                setSelectedDirectory(
                                    directories.find(
                                        (directory) =>
                                            directory.name === e.target.value
                                    ) ?? null // use null since find returns either Directory or undefined
                                )
                            }
                        >
                            <option disabled={true}>Select a Directory</option>
                            {directories.map((directory) => (
                                <option key={directory.id}>
                                    {directory.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="btn btn-neutral btn-sm"
                        >
                            Go
                        </button>
                    </div>

                    {/* <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <span className="flex-shrink mx-4">or</span>
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div> */}
                    {/* <button
                        type="button"
                        className="btn btn-neutral"
                        onClick={() => {
                            const modal = document?.getElementById(
                                "Modal"
                            ) as HTMLDialogElement | null;
                            modal?.showModal();
                        }}
                    >
                        Create Directory
                    </button> */}
                </fieldset>
            </form>
        </>
    );
}
