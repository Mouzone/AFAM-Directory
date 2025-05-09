import { useState } from "react";

// type it to be either a general form input or a private form input
export type TextInputProps = {
    label: string;
    data: string;
    setData: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextInput({ label, data, setData }: TextInputProps) {
    const [copied, setCopied] = useState(false);

    //                             inputMode="numeric",                             maxLength={5}

    return (
        <div className="flex flex-col">
            <label className="fieldset-label mb-1">{label}</label>
            <div className="w-full max-w-[16rem]">
                <div className="relative">
                    <input
                        type="text"
                        value={data}
                        onChange={setData}
                        className="input col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <button
                        onClick={async () => {
                            await navigator.clipboard.writeText(data);
                            setCopied(true);
                        }}
                        className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
                        aria-label="Copy to clipboard"
                    >
                        {!copied ? (
                            <svg
                                className="w-3.5 h-3.5"
                                fill="currentColor"
                                viewBox="0 0 18 20"
                            >
                                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                            </svg>
                        ) : (
                            <svg
                                className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500"
                                fill="none"
                                viewBox="0 0 16 12"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 5.917 5.724 10.5 15 1.5"
                                />
                            </svg>
                        )}
                    </button>
                    <div
                        className={`absolute z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs tooltip dark:bg-gray-700 ${
                            copied
                                ? "opacity-100 visible"
                                : "opacity-0 invisible"
                        }`}
                        style={{
                            top: "calc(100% + 0.5rem)",
                            right: "0",
                        }}
                    >
                        {copied ? "Copied!" : "Copy to clipboard"}
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
