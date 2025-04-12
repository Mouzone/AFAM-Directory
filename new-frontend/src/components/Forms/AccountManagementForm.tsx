import closeModal from "@/utility/closeModal";

export default function AccountManagementForm({ staff }) {
    return (
        <>
            <form method="dialog">
                <button
                    className="btn btn-md btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => closeModal()}
                >
                    ✕
                </button>
            </form>
        </>
    );
}
