"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../components/Providers/AuthProvider";
import { usePathname } from "next/navigation";
import { getStudents } from "../../../../utility/getters/getStudents";
import Table from "@/components/Table";
import Options from "@/components/Options";
import Modal from "@/components/Modal";
import showModal from "@/utility/showModal";
import StudentForm from "@/components/Forms/StudentForm";
import { generalFormDataDefault } from "@/utility/consts";
import AccountManagementForm from "@/components/Forms/AccountManagementForm";
import { getStaff } from "@/utility/getters/getStaff";
import {
    Directory,
    StaffObject,
    StudentGeneralInfoObject,
} from "@/utility/types";

export default function Page() {
    const pathname = usePathname();

    const { user, directories } = useContext(AuthContext);
    const [permissions, setPermissions] = useState<Directory | undefined>(
        undefined
    );
    const [directoryId, setDirectoryId] = useState("");
    const [studentFormState, setStudentFormState] = useState<string>("");
    const [students, setStudents] = useState<StudentGeneralInfoObject>({});
    const [staff, setStaff] = useState<StaffObject>({});
    const [showDeleteStudents, setShowDeleteStudents] = useState(false);

    console.log(user, directoryId);
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

    const { data: studentsData } = useQuery({
        queryKey: [directoryId, "student"],
        queryFn: () => getStudents(directoryId),
        enabled: directoryId != "",
    });

    const { data: staffData } = useQuery({
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

    delete staff[user.uid];
    return (
        <>
            <Modal>
                {studentFormState === "accounts" ? (
                    <AccountManagementForm staff={staff} setStaff={setStaff} />
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
                    showDeleteStudents={showDeleteStudents}
                    addStudentOnClick={() => {
                        setStudentFormState("");
                        showModal();
                    }}
                    manageAccountsOnClick={() => {
                        setStudentFormState("accounts");
                        showModal();
                    }}
                    showDeleteStudentsOnClick={() => {
                        setShowDeleteStudents((prev) => !prev);
                    }}
                />
                <Table
                    data={students}
                    setData={setStudents}
                    showEditStudent={(studentId: string) => {
                        setStudentFormState(studentId);
                        showModal();
                    }}
                    showDeleteStudents={showDeleteStudents}
                />
            </div>
        </>
    );
}
