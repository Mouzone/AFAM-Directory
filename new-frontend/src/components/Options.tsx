import Image from "next/image";
import plus from "../../public/svgs/plus.svg";
import account from "../../public/svgs/account.svg";

export default function Options({ showAddStudent, showAccounts }) {
    return (
        <div className="join">
            <button
                className="btn join-item"
                type="button"
                onClick={showAddStudent}
            >
                <Image src={plus} alt="add" />
                <span> Add Student</span>
            </button>
            <button
                className="btn join-item"
                type="button"
                onClick={showAccounts}
            >
                <Image src={account} alt="accounts" />
                <span> Manage Accounts </span>
            </button>
        </div>
    );
}
