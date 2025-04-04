"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/Providers/AuthProvider";
import { usePathname } from "next/navigation";
import { getStudents } from "../../utility/getStudents";

export default function Page() {
    const { user, directories } = useContext(AuthContext);
    const pathname = usePathname();
    const [directoryId, setDirectoryId] = useState("");

    const [isMultiselect, setIsMultiSelect] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);

    // todo: add pagination
    // todo: add redirect if no directory id
    useEffect(() => {
        if (pathname) {
            const segments = pathname.split("/");
            setDirectoryId(segments[segments.length - 1]);
        }
    }, [pathname]);

    const { isLoading, data, error } = useQuery({
        queryKey: [directoryId, "students"],
        queryFn: () => getStudents(directoryId),
    });
    if (!user) {
        return <></>;
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            {Object.keys(data[0]).map((field) => (
                                <th key={field}> {field} </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((person) => (
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
                                {Object.values(person).map((value) => (
                                    <td>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p> {error?.message} </p>
        </>
    );
}
