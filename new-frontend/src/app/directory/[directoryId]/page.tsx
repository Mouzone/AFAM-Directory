"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../components/Providers/AuthProvider";
import { usePathname } from "next/navigation";
import { getDirectory } from "../../../utility/getStudents";
import optionsIcon from "../../../../public/svgs/options.svg";
import Image from "next/image";

export default function Page() {
    const { user, directories } = useContext(AuthContext);
    const pathname = usePathname();
    const [directoryId, setDirectoryId] = useState("");

    const [isMultiselect, setIsMultiSelect] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);

    // todo: add pagination
    // todo: add redirect if no directory id
    // todo: if data is null, it is either the directory DNE or just no students, cover both casses
    useEffect(() => {
        if (pathname) {
            const segments = pathname.split("/");
            setDirectoryId(segments[segments.length - 1]);
        }
    }, [pathname]);

    const {
        isLoading,
        data: directory,
        error,
    } = useQuery({
        queryKey: [directoryId, "students"],
        queryFn: () => getDirectory(directoryId),
    });
    if (!user) {
        return <></>;
    }
    if (!directory) {
        return <></>;
    }
    return (
        <>
            <div className="flex justify-end">
                <div className="dropdown dropdown-end dropdown-hover">
                    <Image priority src={optionsIcon} alt="menu" />
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                    >
                        <li>Add Person</li>
                        <li>Filter</li>
                        <li>Multiselect</li>
                    </ul>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            {directory["metadata"]["schema"].map((field) => (
                                <th key={field}> {field} </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {directory["data"].map((person) => (
                            <tr key={person.id} className="hover:bg-base-300">
                                {isMultiselect && (
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={selected.includes(
                                                person.id
                                            )}
                                            onChange={() =>
                                                selected.includes(person.id)
                                                    ? selected.filter(
                                                          (id) =>
                                                              id !== person.id
                                                      )
                                                    : [...selected, person.id]
                                            }
                                        />
                                    </td>
                                )}
                                {directory["metadata"]["schema"].map(
                                    (field) => (
                                        <td key={field}>{person[field]}</td>
                                    )
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p> {error?.message} </p>
        </>
    );
}
