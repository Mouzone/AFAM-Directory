import { SetStateAction } from "react";

interface ButtonsProps {
    type: "add" | "view";
    isEdit: boolean;
    showDelete: boolean;
    onDelete: () => void;
    setIsEdit: React.Dispatch<SetStateAction<boolean>>;
    closeForm: () => void;
}

export default function Buttons({
    type,
    isEdit,
    showDelete,
    onDelete,
    setIsEdit,
    closeForm,
}: ButtonsProps) {
    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsEdit(true);
    };

    return (
        <div className=" justify-end bg-white flex gap-4">
            {type === "add" || isEdit ? (
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Submit
                </button>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={onClick}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>
                    {showDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    )}
                </>
            )}

            <button
                type="button"
                onClick={closeForm}
                className="bg-white border-2 px-3 py-2 rounded hover:bg-gray-300"
            >
                Cancel
            </button>
        </div>
    );
}
