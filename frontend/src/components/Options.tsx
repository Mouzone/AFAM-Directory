import Image from "next/image";
import plus from "../../public/svgs/plus.svg";
import account from "../../public/svgs/account.svg";
import minus from "../../public/svgs/minus.svg";
import search from "../../public/svgs/search.svg";
import invite from "../../public/svgs/invite.svg";
import { StudentGeneralInfo } from "@/utility/types";
import { generalFormDataDefault } from "@/utility/consts";

type OptionsProps = {
    showManageAccounts: boolean;
    addStudentOnClick: (student: StudentGeneralInfo) => void;
    manageAccountsOnClick: () => void;
    showDeleteStudentsOnClick: () => void;
    searchOnClick: () => void;
    showDeleteStudents: boolean;
    showSearch: boolean;
    showQRCode: () => void;
};
export default function Options({
    showManageAccounts,
    showSearch,
    searchOnClick,
    addStudentOnClick,
    manageAccountsOnClick,
    showDeleteStudentsOnClick,
    showDeleteStudents,
    showQRCode,
}: OptionsProps) {
    return (
        <div className="p-4 overflow-y-scroll">
            <div className="join">
                <button
                    className={`btn join-item  ${
                        showSearch
                            ? "btn-secondary dark:btn-accent"
                            : "dark:btn-secondary"
                    }`}
                    type="button"
                    onClick={searchOnClick}
                >
                    <Image src={search} alt="search" />
                    <span>Search Student</span>
                </button>
                <button
                    className="btn join-item dark:btn-secondary"
                    type="button"
                    onClick={() => addStudentOnClick(generalFormDataDefault)}
                >
                    <Image src={plus} alt="add" />
                    <span> Add Student</span>
                </button>
                <button
                    className={`btn join-item ${
                        showDeleteStudents
                            ? "btn-secondary dark:btn-accent"
                            : "dark:btn-secondary"
                    }`}
                    type="button"
                    onClick={showDeleteStudentsOnClick}
                >
                    <Image src={minus} alt="delete" />
                    <span>Delete Students</span>
                </button>
                <button
                    className={`btn join-item ${
                        showDeleteStudents
                            ? "btn-secondary dark:btn-accent"
                            : "dark:btn-secondary"
                    }`}
                    type="button"
                    onClick={showQRCode}
                >
                    <Image src={invite} alt="delete" />
                    <span>Show Newcomer Form</span>
                </button>
                {showManageAccounts && (
                    <button
                        className="btn join-item dark:btn-secondary"
                        type="button"
                        onClick={manageAccountsOnClick}
                    >
                        <Image src={account} alt="accounts" />
                        <span> Manage Accounts </span>
                    </button>
                )}
            </div>
        </div>
    );
}
