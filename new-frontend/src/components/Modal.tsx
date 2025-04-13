import { ReactNode } from "react";

type ModalProps = {
    children: ReactNode;
};
export default function Modal({ children }: ModalProps) {
    return (
        <dialog id="Modal" className="modal modal-middle">
            <div className="modal-box flex justify-center">{children}</div>
        </dialog>
    );
}
