"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../components/Providers/AuthProvider";
import { usePathname } from "next/navigation";
import { getStudents } from "../../../utility/getters/getStudents";
import Table from "@/components/Table";
import Options from "@/components/Options";
import Modal from "@/components/Modal";
import showModal from "@/utility/showModal";
import StudentForm from "@/components/Forms/StudentForm";
import { generalFormDataDefault } from "@/utility/consts";
import AccountManagementForm from "@/components/Forms/AccountManagementForm";
import { getStaff } from "@/utility/getters/getStaff";
import { Directory } from "@/utility/types";

export default function Page() {
    const { user, directories } = useContext(AuthContext);
    const pathname = usePathname();
    const [directoryId, setDirectoryId] = useState("");
    const [studentFormState, setStudentFormState] = useState<string | null>(
        null
    );
    const [students, setStudents] = useState(null);
    const [staff, setStaff] = useState(null);
    const [permissions, setPermissions] = useState<Directory | undefined>(
        undefined
    );

    useEffect(() => {
        if (pathname) {
            const segments = pathname.split("/");
            setDirectoryId(segments[segments.length - 1]);
            setPermissions(
                directories
                    ?.filter(
                        (directory) =>
                            directory.name === segments[segments.length - 1]
                    )
                    .at(0)
            );
        }
    }, [pathname, directories]);

    const {
        isLoading: studentsDataIsLoading,
        data: studentsData,
        error: studentsDataError,
    } = useQuery({
        queryKey: [directoryId, "student"],
        queryFn: () => getStudents(directoryId),
        enabled: directoryId != "",
    });

    const {
        isLoading: staffDataIsLoading,
        data: staffData,
        error: staffDataError,
    } = useQuery({
        queryKey: [directoryId, "staff"],
        queryFn: () => getStaff(directoryId),
        enabled: directoryId != "",
    });

    useEffect(() => {
        if (studentsData) {
            setStudents(studentsData);
        }
    }, [studentsData]);

    useEffect(() => {
        if (staffData) {
            setStaff(staffData);
        }
    }, [staffData, user]);

    if (!user) {
        return <></>;
    }

    if (!students) {
        return <></>;
    }

    if (!staff) {
        return <></>;
    }

    if (!permissions) {
        return <></>;
    }

    const { [user.uid]: omitted, ...staffOmitSelf } = staff;

    return (
        <>
            <Modal>
                {studentFormState === "accounts" ? (
                    <AccountManagementForm
                        staff={staffOmitSelf}
                        setStaff={setStaff}
                    />
                ) : (
                    <StudentForm
                        studentId={studentFormState}
                        generalFormState={
                            studentFormState
                                ? students[studentFormState]
                                : generalFormDataDefault
                        }
                        setStudents={setStudents}
                        showPrivate={permissions["Private"]}
                    />
                )}
            </Modal>

            <div className="p-4">
                <Options
                    showManageAccounts={permissions["Manage Accounts"]}
                    addStudentOnClick={() => {
                        setStudentFormState(null);
                        showModal();
                    }}
                    manageAccountsOnClick={() => {
                        setStudentFormState("accounts");
                        showModal();
                    }}
                />
                <Table
                    data={students}
                    showEditStudent={(studentId) => {
                        setStudentFormState(studentId);
                        showModal();
                    }}
                />
            </div>
        </>
    );
}
