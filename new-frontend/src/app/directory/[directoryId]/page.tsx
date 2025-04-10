"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../components/Providers/AuthProvider";
import { usePathname } from "next/navigation";
import { getDirectory } from "../../../utility/getDirectory";
import Table from "@/components/Table";
import Options from "@/components/Options";
import Modal from "@/components/Modal";
import showModal from "@/utility/showModal";
import StudentForm from "@/components/Forms/StudentForm";
import {
    generalFormDataDefault,
    privateFormDataDefault,
} from "@/utility/consts";

export default function Page() {
    const { user, directories } = useContext(AuthContext);
    const pathname = usePathname();
    const [directoryId, setDirectoryId] = useState("");
    const [studentFormState, setStudentFormState] = useState<number | null>(
        null
    );

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
        queryKey: [directoryId, "student"],
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
        <>
            <Modal>
                {/* pass in start state for generalState, run it and if missing then don't fetch private */}
                <StudentForm
                    studentId={studentFormState}
                    generalFormState={
                        studentFormState
                            ? directory[studentFormState]["General"]
                            : generalFormDataDefault
                    }
                    privateFormState={
                        studentFormState
                            ? directory[studentFormState]["Private"]
                            : privateFormDataDefault
                    }
                />
            </Modal>

            <div className="p-4">
                <Options
                    showAddStudent={() => {
                        setStudentFormState(null);
                        showModal();
                    }}
                />
                <Table
                    data={directory}
                    showEditStudent={(studentId) => {
                        setStudentFormState(studentId);
                        showModal();
                    }}
                />

                <p> {error?.message} </p>
            </div>
        </>
    );
}
