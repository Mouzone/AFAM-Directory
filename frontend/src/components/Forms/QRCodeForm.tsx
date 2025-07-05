import closeModal from "@/utility/closeModal";
import Image from "next/image";

export default function QRCodeForm() {
    return (
        <div className="flex flex-col">
            <form method="dialog" className="mb-5">
                <button
                    className="btn btn-md btn-circle btn-ghost absolute right-2 top-2 dark:btn-secondary"
                    onClick={() => {
                        closeModal();
                    }}
                >
                    ✕
                </button>
            </form>
            <Image 
                src="/website-qrcode.png" 
                width={500}
                height={500}
                alt="Newcomer Form"
            />
        </div>
    );
}
