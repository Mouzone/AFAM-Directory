"use client";

import React, { useState, useEffect, SetStateAction } from "react";

type NotificationsProps = {
    email: string;
    sent: boolean;
    setSent: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Notifications({
    email,
    sent,
    setSent,
    error,
    setError,
}: NotificationsProps) {
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        if (sent) {
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
                setSent(false); // Reset copied state
            }, 1000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        } else if (error) {
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
                setError(null); // Reset copied state
            }, 1000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [sent, setSent]);

    return (
        <div className="fixed top-4 right-20 space-y-2 z-50">
            {showNotification && (
                <div
                    className={`${
                        sent
                            ? "bg-blue-100 border border-blue-400 text-blue-700"
                            : "bg-red-100 border border-red-400 text-red-700"
                    } px-4 py-3 rounded-md shadow-md animate-slide-in`}
                >
                    <strong className="font-bold">
                        {sent ? "Sent! " : "Error "}
                    </strong>
                    <span className="block sm:inline">
                        {sent ? `Signup Link sent to: ${email}. ` : `${error}`}
                    </span>
                </div>
            )}
            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
