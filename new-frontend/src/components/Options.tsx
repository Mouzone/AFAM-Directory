import Image from "next/image";
import plus from "../../public/svgs/plus.svg";

export default function Options({ showAddStudent }) {
    return (
        <ul className="menu menu-sm menu-horizontal bg-base-200 rounded-box mt-6">
            <li>
                <a className="tooltip" data-tip="Add" onClick={showAddStudent}>
                    <Image src={plus} alt="add" />
                    <span>Add</span>
                </a>
            </li>
        </ul>
    );
}
