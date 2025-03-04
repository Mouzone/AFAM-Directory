"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/utility/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Role } from "@/types";
import { doc, getDoc } from "firebase/firestore";

export default function Page() {
    const [role, setRole] = useState<Role | null>(null);
    const [invitableRoles, setInvitableRoles] = useState<Role[] | null>(null);
    const [loading, setLoading] = useState(true); // Added loading state
    const router = useRouter();

    const onClick = () => {
        
    }
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const idTokenResult = await user.getIdTokenResult();
                setRole(idTokenResult.claims.role as Role);
            } else {
                router.push("/");
            }
            setLoading(false); // Set loading to false after auth check
        });

        return () => unsubscribe(); // Cleanup the listener
    }, [router]);

    useEffect(() => {
        async function fetchInvitableRoles() {
            if (role) {
                const docRef = doc(db, "roles", role);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setInvitableRoles(docSnap.data().canInvite as Role[]);
                } else {
                    console.error("Document not found");
                }
            }
        }

        fetchInvitableRoles();
    }, [role]);

    if (loading) {
        return <div>Loading...</div>; // Show a loading indicator while checking auth
    }

    if (!role) {
        return null; // Don't render anything if not authenticated
    }

    if (!invitableRoles) {
        return <div>Loading roles...</div>; // Show loading while fetching roles
    }

    return (
        <>
            <select>
                {invitableRoles.map((invitableRole) => (
                    <option key={invitableRole} value={invitableRole}>
                        {invitableRole}
                    </option>
                ))}
            </select>
            <button> Generate Link </button>
        </>
    );
}