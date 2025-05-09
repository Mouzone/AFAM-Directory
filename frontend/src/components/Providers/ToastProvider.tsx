import { ToastContextType } from "@/utility/types";
import { createContext, ReactNode, useEffect, useState } from "react";

export const ToastContext = createContext<ToastContextType | undefined>(
    undefined
);

type ToastProviderProps = {
    children: ReactNode;
};

export default function ToastProvider({ children }: ToastProviderProps) {
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!message) return;

        const timeout = setTimeout(() => {
            setMessage("");
        }, 1000);

        return () => clearTimeout(timeout); // Cleanup on unmount or message change
    }, [message]);

    return (
        <ToastContext.Provider value={{ message, setMessage }}>
            {children}
        </ToastContext.Provider>
    );
}
