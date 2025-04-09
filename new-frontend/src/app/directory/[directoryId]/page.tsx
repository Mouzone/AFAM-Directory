"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../components/Providers/AuthProvider";
import { usePathname } from "next/navigation";
import { getDirectory } from "../../../utility/getStudents";
import Table from "@/components/Table";
import Options from "@/components/Options";
import Modal from "@/components/Modal";
import CreateStudentForm from "@/components/Forms/CreateStudentForm";
import showModal from "@/utility/showModal";

export default function Page() {
    const { user, directories } = useContext(AuthContext);
    const pathname = usePathname();
    const [directoryId, setDirectoryId] = useState("");

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

    const { isLoading, data, error } = useQuery({
        queryKey: [directoryId, "students"],
        queryFn: () => getDirectory(directoryId),
        enabled: directoryId != "",
    });

    if (!user) {
        return <></>;
    }
    if (!data) {
        return <></>;
    }
    return (
        <>
            <Modal>
                <CreateStudentForm />
            </Modal>

            <div className="p-4">
                <Options showAddStudent={() => showModal()} />
                <Table data={data} />

                <p> {error?.message} </p>
            </div>
        </>
    );
}
