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
import { generalFormDataDefault, searchTermsState } from "@/utility/consts";
import AccountManagementForm from "@/components/Forms/AccountManagementForm";
import { getStaff } from "@/utility/getters/getStaff";
import {
    Directory,
    SearchTerms,
    StaffObject,
    StudentGeneralInfo,
} from "@/utility/types";
import SearchForm from "@/components/Forms/SearchForm";

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
    const [searchTerms, setSearchTerms] =
        useState<SearchTerms>(searchTermsState);
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

    const filtered = students.filter((student) => {
        const firstNameMatch =
            searchTerms["First Name"] === "" ||
            student["First Name"]
                .toLowerCase()
                .includes(searchTerms["First Name"].toLowerCase());

        const lastNameMatch =
            searchTerms["Last Name"] === "" ||
            student["Last Name"]
                .toLowerCase()
                .includes(searchTerms["Last Name"].toLowerCase());

        const highSchoolMatch =
            searchTerms["High School"] === "" ||
            student["High School"]
                .toLowerCase()
                .includes(searchTerms["High School"].toLowerCase());

        return firstNameMatch && lastNameMatch && highSchoolMatch;
    });

    return (
        <>
            <Modal>
                {formToShow === "accounts" ? (
                    <AccountManagementForm staff={staff} setStaff={setStaff} />
                ) : formToShow === "search" ? (
                    <SearchForm
                        searchTerms={searchTerms}
                        setSearchTerms={setSearchTerms}
                    />
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
                    searchOnClick={() => {
                        setFormToShow("search");
                        showModal();
                    }}
                    showDeleteStudentsOnClick={() => {
                        setShowDeleteStudents((prev) => !prev);
                    }}
                />
                <Table
                    data={filtered}
                    setData={setStudents}
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
