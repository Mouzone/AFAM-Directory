"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../components/Providers/AuthProvider";
import Table from "@/components/Table";
import Options from "@/components/Options";
import Modal from "@/components/Modal";
import showModal from "@/utility/showModal";
import StudentForm from "@/components/Forms/StudentForm";
import { generalFormDataDefault } from "@/utility/consts";
import AccountManagementForm from "@/components/Forms/AccountManagementForm";
import {
    AccountInfo,
    Staff,
    StaffObject,
    StudentGeneralInfo,
} from "@/utility/types";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { db } from "@/utility/firebase";
import { ToastContext } from "@/components/Providers/ToastProvider";

export default function Page() {
    const user = useContext(AuthContext);
    const { message } = useContext(ToastContext)!;

    const [studentFormState, setStudentFormState] =
        useState<StudentGeneralInfo>(generalFormDataDefault);
    const [formToShow, setFormToShow] = useState("student");
    const [students, setStudents] = useState<StudentGeneralInfo[]>([]);
    const [staff, setStaff] = useState<StaffObject>({});
    const [accountInfo, setAccountInfo] = useState<AccountInfo>();
    const [showDeleteStudents, setShowDeleteStudents] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        if (user) {
            return onSnapshot(
                doc(db, "directory", "afam", "staff", user.uid),
                (doc) => {
                    setAccountInfo({ ...doc.data() } as AccountInfo);
                }
            );
        }
    }, [user]);

    useEffect(() => {
        if (user && accountInfo) {
            const studentQuery = query(
                collection(db, "directory", "afam", "student")
            );
            return onSnapshot(studentQuery, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    const data = {
                        ...change.doc.data(),
                        Id: change.doc.id,
                    } as StudentGeneralInfo;
                    console.log(data);
                    if (change.type === "added") {
                        setStudents((prev) => [...prev, data]);
                    } else if (change.type === "modified") {
                        setStudents((prev) =>
                            prev.map((student) =>
                                student.Id === change.doc.id ? data : student
                            )
                        );
                    } else if (change.type === "removed") {
                        setStudents((prev) =>
                            prev.filter(
                                (student) => student.Id !== change.doc.id
                            )
                        );
                    }
                });
            });
        }
    }, [user, accountInfo]);

    useEffect(() => {
        if (user && accountInfo) {
            const staffQuery = query(
                collection(db, "directory", "afam", "staff")
            );
            return onSnapshot(staffQuery, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        staff[change.doc.id] = change.doc.data() as Staff;
                    } else if (change.type === "modified") {
                        staff[change.doc.id] = change.doc.data() as Staff;
                    } else {
                        delete staff[change.doc.id];
                    }
                });
                setStaff({ ...staff });
            });
        }
    }, [user, accountInfo]);

    if (!user) {
        return <></>;
    }

    if (!students) {
        return <></>;
    }

    if (!staff) {
        return <></>;
    }

    if (!accountInfo) {
        return <></>;
    }

    delete staff[user.uid];

    return (
        <>
            <Modal>
                {formToShow === "accounts" ? (
                    <AccountManagementForm staff={staff} />
                ) : (
                    <StudentForm
                        generalFormState={studentFormState}
                        showPrivate={accountInfo["Private"]}
                    />
                )}
            </Modal>

            <div className="p-4">
                <Options
                    showManageAccounts={accountInfo["Manage Accounts"]}
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
                    showSearch={showSearch}
                    showEditStudent={(student: StudentGeneralInfo) => {
                        setStudentFormState(student);
                        setFormToShow("student");
                        showModal();
                    }}
                    showDeleteStudents={showDeleteStudents}
                />
            </div>
            {message && (
                <div className="toast">
                    <div
                        className={`alert alert-info ${
                            message.includes("successfully")
                                ? "bg-green-300"
                                : "bg-red-300"
                        }`}
                    >
                        <span>{message}</span>
                    </div>
                </div>
            )}
        </>
    );
}
