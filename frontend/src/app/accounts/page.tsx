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
    const [token, setToken] = useState<string | null>(null)
    const [invitableRoles, setInvitableRoles] = useState<Role[] | null>(null);
    const [loading, setLoading] = useState(true); // Added loading state
    const router = useRouter();

    const onClick = async () => {
        try {
            const response: HttpsCallableResult<GenerateInviteResponse> = await generateInviteToken({ role: roleToCreate })
            setToken(response.data.token)
        } catch(e) {
            console.log(e)
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRoleToCreate(e.target.value as Role)
    }

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
            <select onChange={onChange} value={roleToCreate}>
                {invitableRoles.map((invitableRole) => (
                    <option key={invitableRole} value={invitableRole}>
                        {invitableRole}
                    </option>
                ))}
            </select>
            <div> {`${window.location.origin}/signup?token=${token}`} </div>
            <button type="button" onClick={onClick}> Generate Link </button>
            <button type="button" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/signup?token=${token}`)}>
                Copy
            </button>
        </>
    );
}