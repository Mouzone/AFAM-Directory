import Image from "next/image";
import plus from "../../public/svgs/plus.svg";
import account from "../../public/svgs/account.svg";
import minus from "../../public/svgs/minus.svg";

export default function Options({
    showManageAccounts,
    addStudentOnClick,
    manageAccountsOnClick,
    showDeleteStudentsOnClick,
}) {
    return (
        <div className="join">
            <button
                className="btn join-item"
                type="button"
                onClick={addStudentOnClick}
            >
                <Image src={plus} alt="add" />
                <span> Add Student</span>
            </button>
            <button
                className="btn join-item"
                type="button"
                onClick={showDeleteStudentsOnClick}
            >
                <Image src={minus} alt="delete" />
                <span> Delete Students </span>
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
