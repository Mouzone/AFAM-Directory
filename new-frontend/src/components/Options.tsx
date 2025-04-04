import Image from "next/image";
import plus from "../../public/svgs/plus.svg";

export default function Options({ setIsAddStudent }) {
    return (
        <ul className="menu menu-sm menu-horizontal bg-base-200 rounded-box mt-6">
            <li>
                <a
                    className="tooltip"
                    data-tip="Home"
                    onClick={() => setIsAddStudent(true)}
                >
                    <Image src={plus} alt="add" />
                    <span>Add</span>
                </a>
            </li>
        </ul>
    );
}
