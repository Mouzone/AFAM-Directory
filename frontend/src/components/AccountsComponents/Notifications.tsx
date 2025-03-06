"use client"

import React, { useState, useEffect, SetStateAction } from 'react';

type NotificationsProps = {
    generated: boolean,
    copied: boolean,
    setGenerated: React.Dispatch<SetStateAction<boolean>>,
    setCopied: React.Dispatch<SetStateAction<boolean>>
}

export default function Notifications({ generated, copied, setGenerated, setCopied }: NotificationsProps) {
  const [showGenerated, setShowGenerated] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if (generated) {
      setShowGenerated(true);
      const timer = setTimeout(() => {
        setShowGenerated(false);
        setGenerated(false); // Reset generated state
      }, 1500); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [generated, setGenerated]);

  useEffect(() => {
    if (copied) {
      setShowCopied(true);
      const timer = setTimeout(() => {
        setShowCopied(false);
        setCopied(false); // Reset copied state
      }, 1000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [copied, setCopied]);

  return (
    <div className="fixed top-4 right-20 space-y-2 z-50">
      {showGenerated && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-md animate-slide-in">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Link Generated.</span>
        </div>
      )}
      {showCopied && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md shadow-md animate-slide-in">
          <strong className="font-bold">Copied!</strong>
          <span className="block sm:inline"> Link Copied to clipboard.</span>
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