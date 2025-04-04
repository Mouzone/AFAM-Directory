"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../components/Providers/AuthProvider";
import { usePathname } from "next/navigation";
import { getDirectory } from "../../../utility/getStudents";
import optionsIcon from "../../../../public/svgs/options.svg";
import Image from "next/image";
import Table from "@/components/Table";
import Options from "@/components/Options";
import AddStudentModal from "@/components/Modals/AddStudentModal";

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
            <Options setIsAddStudent={setIsAddStudent} />
            <Table
                schema={directory["metadata"]["schema"]}
                data={directory["data"]}
            />

            {isAddStudent && <AddStudentModal />}
            <p> {error?.message} </p>
        </div>
    );
}
