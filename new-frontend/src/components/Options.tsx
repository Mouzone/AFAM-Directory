import Image from "next/image";
import plus from "../../public/svgs/plus.svg";
import account from "../../public/svgs/account.svg";

export default function Options({ showAddStudent, showAccounts }) {
    return (
        <ul className="menu menu-sm menu-horizontal bg-base-200 rounded-box mt-6">
            <li>
                <a className="tooltip" data-tip="Add" onClick={showAddStudent}>
                    <Image src={plus} alt="add" />
                    <span>Add</span>
                </a>
            </li>
            <li>
                <a
                    className="tooltip"
                    data-tip="Accounts"
                    onClick={showAccounts}
                >
                    <Image src={account} alt="accounts" />
                    <span>Accounts</span>
                </a>
            </li>
        </ul>
    );
}
