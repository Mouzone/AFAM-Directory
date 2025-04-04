"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../components/Providers/AuthProvider";
import { usePathname } from "next/navigation";
import { getDirectory } from "../../../utility/getStudents";
import optionsIcon from "../../../../public/svgs/options.svg";
import Image from "next/image";
import Table from "@/components/Table";

export default function Page() {
    const { user, directories } = useContext(AuthContext);
    const pathname = usePathname();
    const [directoryId, setDirectoryId] = useState("");

    const [isMultiselect, setIsMultiSelect] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);

    const [isAddStudent, setIsAddStudent] = useState(false);

    const [isSearch, setIsSearch] = useState(false);
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
        enabled: directoryId != "",
    });

    if (!user) {
        return <></>;
    }
    if (!directory) {
        return <></>;
    }
    return (
        <div className="p-4">
            <div className="flex justify-end pb-4">
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
            <Table
                schema={directory["metadata"]["schema"]}
                data={directory["data"]}
            />

            <p> {error?.message} </p>
        </div>
    );
}
