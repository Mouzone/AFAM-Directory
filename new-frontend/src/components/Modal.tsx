import { ReactNode } from "react";

export default function Modal({ children }) {
    return (
        <dialog id="Modal" className="modal modal-middle">
            <div className="modal-box flex justify-center">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                </form>
                {children}
            </div>
        </dialog>
    );
}
