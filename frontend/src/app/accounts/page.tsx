"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/utility/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { GenerateInviteResponse, Role, Subordinate } from "@/types";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { deleteUser, generateInviteToken } from "@/utility/cloud-functions";
import { HttpsCallableResult } from "firebase/functions";
import Notifications from "@/components/AccountsComponents/Notifications";

export default function Page() {
    const [userRole, setUserRole] = useState<Role | null>(null);
    const [roleToCreate, setRoleToCreate] = useState<Role>("student");
    const [token, setToken] = useState<string | null>(null);
    const [invitableRoles, setInvitableRoles] = useState<Role[] | null>(null);
    const [subordinates, setSubordinates] = useState<Subordinate[]>([]);

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
                const docRef = doc(db, "privileges", userRole);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setInvitableRoles(docSnap.data().canInvite as Role[]);
                } else {
                    console.error("Document not found");
                }
            }
        }

        async function fetchSubordinates() {
            const subordinates: Subordinate[] = [];
            if (
                userRole === "admin" ||
                userRole === "pastor" ||
                userRole == "welcome team leader"
            ) {
                const studentsSnapshot = await getDocs(
                    collection(db, "organization", "roles", "student")
                );
                studentsSnapshot.forEach((studentDoc) => {
                    subordinates.push({
                        ...studentDoc.data(),
                        id: studentDoc.id,
                        role: "student",
                    });
                });
            }
            if (userRole === "admin" || userRole === "pastor") {
                const welcomeTeamLeadersSnapshot = await getDocs(
                    collection(
                        db,
                        "organization",
                        "roles",
                        "welcome team leader"
                    )
                );
                welcomeTeamLeadersSnapshot.forEach((welcomeTeamLeaderDoc) => {
                    subordinates.push({
                        ...welcomeTeamLeaderDoc.data(),
                        id: welcomeTeamLeaderDoc.id,
                        role: "welcome team leader",
                    });
                });

                const deaconsSnapshot = await getDocs(
                    collection(db, "organization", "roles", "deacon")
                );
                deaconsSnapshot.forEach((deaconDoc) => {
                    subordinates.push({
                        ...deaconDoc.data(),
                        id: deaconDoc.id,
                        role: "deacon",
                    });
                });

                const teachersSnapshot = await getDocs(
                    collection(db, "organization", "roles", "teacher")
                );
                teachersSnapshot.forEach((teacherDoc) => {
                    subordinates.push({
                        ...teacherDoc.data(),
                        id: teacherDoc.id,
                        role: "teacher",
                    });
                });
            }
            if (userRole == "admin") {
                const pastorsSnapshot = await getDocs(
                    collection(db, "organization", "roles", "pastor")
                );
                pastorsSnapshot.forEach((pastorDoc) => {
                    subordinates.push({
                        ...pastorDoc.data(),
                        id: pastorDoc.id,
                        role: "pastor",
                    });
                });
            }
            setSubordinates(subordinates);
        }

        fetchInvitableRoles();
        fetchSubordinates();
    }, [userRole]);

    const onGenerateLink = async () => {
        try {
            const response: HttpsCallableResult<GenerateInviteResponse> =
                await generateInviteToken({ role: roleToCreate });
            setToken(response.data.token);
            setGenerated(true);
        } catch (e) {
            console.log(e);
        }
    };

    const onCopy = () => {
        navigator.clipboard.writeText(
            `${window.location.origin}/signup?token=${token}`
        );
        setCopied(true);
    };

    const onDelete = async (id: string) => {
        try {
            await deleteUser({id})
            const newSubordinates = subordinates.filter(subordinate => subordinate.id !== id)
            setSubordinates(newSubordinates)
        } catch(e) {
            console.log(e);
        }
    }

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
                    onChange={(e) => setRoleToCreate(e.target.value as Role)}
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
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {subordinates &&
                        subordinates.map((subordinate) => {
                            return (
                                <tr
                                    key={`${
                                        subordinate.id
                                    }`}
                                >
                                    <td>{subordinate.firstName}</td>
                                    <td>{subordinate.lastName}</td>
                                    <td>{subordinate.role}</td>
                                    <td>{subordinate.email}</td>
                                    <td>
                                        <button onClick={() => onDelete(subordinate.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
            <Notifications
                generated={generated}
                copied={copied}
                setGenerated={setGenerated}
                setCopied={setCopied}
            />
        </>
    );
}
