"use client";

import React, { useState, useEffect, SetStateAction } from "react";

type NotificationsProps = {
    email: string;
    sent: boolean;
    setSent: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Notifications({
    email,
    sent,
    setSent,
}: NotificationsProps) {
    const [showSent, setShowSent] = useState(false);

    useEffect(() => {
        if (sent) {
            setShowSent(true);
            const timer = setTimeout(() => {
                setShowSent(false);
                setSent(false); // Reset copied state
            }, 1000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [sent, setSent]);

    return (
        <div className="fixed top-4 right-20 space-y-2 z-50">
            {showSent && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md shadow-md animate-slide-in">
                    <strong className="font-bold">Sent!</strong>
                    <span className="block sm:inline">
                        Signup Link sent to: {email}.
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
