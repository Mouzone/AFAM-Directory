export default function Modal({ children }) {
    return (
        <dialog id="Modal" className="modal modal-middle">
            <div className="modal-box flex justify-center">{children}</div>
        </dialog>
    );
}
