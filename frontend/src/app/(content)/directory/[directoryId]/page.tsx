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
import { Directory, StaffObject, StudentGeneralInfo } from "@/utility/types";

export default function Page() {
    const pathname = usePathname();

    const { user, directories } = useContext(AuthContext);
    const [permissions, setPermissions] = useState<Directory | undefined>(
        undefined
    );
    const [directoryId, setDirectoryId] = useState("");
    const [studentFormState, setStudentFormState] =
        useState<StudentGeneralInfo>(generalFormDataDefault);
    const [formToShow, setFormToShow] = useState("student");
    const [students, setStudents] = useState<StudentGeneralInfo[]>([]);
    const [staff, setStaff] = useState<StaffObject>({});
    const [showDeleteStudents, setShowDeleteStudents] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

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
                {formToShow === "accounts" ? (
                    <AccountManagementForm staff={staff} setStaff={setStaff} />
                ) : (
                    <StudentForm
                        generalFormState={studentFormState}
                        setStudents={setStudents}
                        showPrivate={permissions["Private"]}
                    />
                )}
            </Modal>

            <div className="p-4">
                <Options
                    showManageAccounts={permissions["Manage Accounts"]}
                    showSearch={showSearch}
                    searchOnClick={() => {
                        setShowSearch((prev) => !prev);
                    }}
                    showDeleteStudents={showDeleteStudents}
                    addStudentOnClick={(student: StudentGeneralInfo) => {
                        setStudentFormState(student);
                        setFormToShow("student");
                        showModal();
                    }}
                    manageAccountsOnClick={() => {
                        setFormToShow("accounts");
                        showModal();
                    }}
                    showDeleteStudentsOnClick={() => {
                        setShowDeleteStudents((prev) => !prev);
                    }}
                />
                <Table
                    data={students}
                    setData={setStudents}
                    showSearch={showSearch}
                    showEditStudent={(student: StudentGeneralInfo) => {
                        setStudentFormState(student);
                        setFormToShow("student");
                        showModal();
                    }}
                    showDeleteStudents={showDeleteStudents}
                />
            </div>
        </>
    );
}
