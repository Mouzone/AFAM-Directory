import Image from "next/image";
import plus from "../../public/svgs/plus.svg";
import account from "../../public/svgs/account.svg";
import minus from "../../public/svgs/minus.svg";
import search from "../../public/svgs/search.svg";
import { StudentGeneralInfo } from "@/utility/types";
import { generalFormDataDefault } from "@/utility/consts";

type OptionsProps = {
    showManageAccounts: boolean;
    addStudentOnClick: (student: StudentGeneralInfo) => void;
    manageAccountsOnClick: () => void;
    showDeleteStudentsOnClick: () => void;
    showDeleteStudents: boolean;
    searchOnClick: () => void;
};
export default function Options({
    showManageAccounts,
    addStudentOnClick,
    manageAccountsOnClick,
    showDeleteStudentsOnClick,
    showDeleteStudents,
    searchOnClick,
}: OptionsProps) {
    return (
        <div className="join w-screen overflow-y-scroll">
            <button
                className="btn join-item"
                type="button"
                onClick={searchOnClick}
            >
                <Image src={search} alt="search" />
                <span> Search Student</span>
            </button>
            <button
                className="btn join-item"
                type="button"
                onClick={() => addStudentOnClick(generalFormDataDefault)}
            >
                <Image src={plus} alt="add" />
                <span> Add Student</span>
            </button>
            <button
                className={`btn join-item ${
                    showDeleteStudents ? "bg-gray-300" : ""
                }`}
                type="button"
                onClick={showDeleteStudentsOnClick}
            >
                <Image src={minus} alt="delete" />
                <span>Delete Students</span>
            </button>
            {showManageAccounts && (
                <button
                    className="btn join-item"
                    type="button"
                    onClick={manageAccountsOnClick}
                >
                    <Image src={account} alt="accounts" />
                    <span> Manage Accounts </span>
                </button>
            )}
        </div>
    );
}
