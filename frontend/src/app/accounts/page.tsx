"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/utility/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { GenerateInviteResponse, Role } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { generateInviteToken } from "@/utility/cloud-functions";
import { HttpsCallableResult } from "firebase/functions";

export default function Page() {
    const [userRole, setUserRole] = useState<Role | null>(null);
    const [roleToCreate, setRoleToCreate] = useState<Role>("student");
    const [token, setToken] = useState<string | null>(null);
    const [invitableRoles, setInvitableRoles] = useState<Role[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [generated, setGenerated] = useState(false);
    const [copied, setCopied] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const idTokenResult = await user.getIdTokenResult();
                setUserRole(idTokenResult.claims.role as Role);
            } else {
                router.push("/");
            }
            setLoading(false); // Set loading to false after auth check
        });

        return () => unsubscribe(); // Cleanup the listener
    }, [router]);

    useEffect(() => {
        async function fetchInvitableRoles() {
            if (userRole) {
                const docRef = doc(db, "roles", userRole);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setInvitableRoles(docSnap.data().canInvite as Role[]);
                } else {
                    console.error("Document not found");
                }
            }
        }

        fetchInvitableRoles();
    }, [userRole]);

    const onGenerateLink = async () => {
        try {
            const response: HttpsCallableResult<GenerateInviteResponse> =
                await generateInviteToken({ role: roleToCreate });
            setToken(response.data.token);
            setGenerated(true);
            setTimeout(() => {
                setGenerated(false);
            }, 1500);
        } catch (e) {
            console.log(e);
        }
    };

    const onCopy = async () => {
        navigator.clipboard.writeText(
            `${window.location.origin}/signup?token=${token}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }
    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRoleToCreate(e.target.value as Role);
    };

    if (loading) {
        return <div>Loading...</div>; // Show a loading indicator while checking auth
    }

    if (!userRole) {
        return null; // Don't render anything if not authenticated
    }

    if (!invitableRoles) {
        return <div>Loading roles...</div>; // Show loading while fetching roles
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-20 items-center">
                <select
                    onChange={onChange}
                    value={roleToCreate}
                    className="border rounded p-2" // Added basic styling to select
                >
                    {invitableRoles.map((invitableRole) => (
                        <option key={invitableRole} value={invitableRole}>
                            {invitableRole}
                        </option>
                    ))}
                </select>
                <div className="w-full md:w-60 truncate border rounded p-2 break-all">
                    {`${window.location.origin}/signup?token=${token}`}
                </div>
                <button
                    type="button"
                    onClick={onGenerateLink}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" // added button styling
                >
                    Generate
                </button>
                <button
                    type="button"
                    onClick={onCopy}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" //added button styling
                >
                    Copy
                </button>
            </div>
            {generated && <p> Link Generated </p>}
            {copied && <p> Link Copied </p>}
        </>
    );
}
