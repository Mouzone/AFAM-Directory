import { ToastContextType } from "@/utility/types";
import { createContext, ReactNode, useState } from "react";

export const ToastContext = createContext<ToastContextType | undefined>(
    undefined
);

type ToastProviderProps = {
    children: ReactNode;
};

export default function ToastProvider({ children }: ToastProviderProps) {
    const [message, setMessage] = useState("");

    return (
        <ToastContext.Provider value={{ message, setMessage }}>
            {children}
        </ToastContext.Provider>
    );
}
