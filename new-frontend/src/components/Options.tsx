import Image from "next/image";
import plus from "../../public/svgs/plus.svg";
import account from "../../public/svgs/account.svg";

export default function Options({
    showManageAccounts,
    addStudentOnClick,
    manageAccountsOnClick,
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
