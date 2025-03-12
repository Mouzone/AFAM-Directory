"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { auth, db } from "@/utility/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { GenerateInviteResponse, Role, Subordinate } from "@/types";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from "firebase/firestore";
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

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [roleToFilter, setRoleToFilter] = useState<Role | "">("");
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
            await deleteUser({ id });
            const newSubordinates = subordinates.filter(
                (subordinate) => subordinate.id !== id
            );
            setSubordinates(newSubordinates);
        } catch (e) {
            console.log(e);
        }
    };

    const changeGrade = (teacherId: string) => {
        return async (e: ChangeEvent<HTMLSelectElement>) => {
            const newSubordinates = subordinates.map((subordinate) =>
                subordinate.id === teacherId
                    ? { ...subordinate, grade: e.target.value }
                    : { ...subordinate }
            );
            setSubordinates([...newSubordinates]);

            const docRef = doc(db, `organization/roles/teacher/`, teacherId);
            await updateDoc(docRef, { grade: e.target.value });
        };
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

    const subordinatesToShow = subordinates.filter((subordinate) => {
        return (
            (roleToFilter === "" || subordinate.role === roleToFilter) &&
            (firstName === "" || subordinate.firstName?.includes(firstName)) &&
            (lastName === "" || subordinate.lastName?.includes(lastName))
        );
    });

    return (
        <>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-20 items-center">
                <select
                    onChange={(e) => setRoleToCreate(e.target.value as Role)}
                    value={roleToCreate}
                    className="border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
                >
                    {invitableRoles.map((invitableRole) => (
                        <option key={invitableRole} value={invitableRole}>
                            {invitableRole}
                        </option>
                    ))}
                </select>
                <div className="w-full md:w-60 truncate border rounded p-2 break-all bg-gray-100 text-sm">
                    {`${window.location.origin}/signup?token=${token}`}
                </div>
                <button
                    type="button"
                    onClick={onGenerateLink}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md transition-colors duration-200"
                >
                    Generate
                </button>
                <button
                    type="button"
                    onClick={onCopy}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow-md transition-colors duration-200"
                >
                    Copy
                </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
                />
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
                />
                <select
                    onChange={(e) => setRoleToFilter(e.target.value as Role)}
                    value={roleToFilter}
                    className="border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
                >
                    <option key="none" value="">
                        All Roles
                    </option>
                    {invitableRoles.map((invitableRole) => (
                        <option key={invitableRole} value={invitableRole}>
                            {invitableRole}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mt-8 overflow-x-auto px-10">
                <table className="min-w-full border border-gray-200 rounded-md">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                First Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                Last Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                Role
                            </th>
                            {roleToFilter === "teacher" && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                    Grade
                                </th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {subordinatesToShow &&
                            subordinatesToShow.map((subordinate) => (
                                <tr key={`${subordinate.id}`}>
                                    <td className="px-6 py-4 whitespace-nowrap w-1/5">
                                        {subordinate.firstName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap w-1/5">
                                        {subordinate.lastName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap w-1/5">
                                        {subordinate.role}
                                    </td>
                                    {roleToFilter === "teacher" && (
                                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                            <select
                                                onChange={changeGrade(
                                                    subordinate.id
                                                )}
                                                value={
                                                    subordinate?.grade ?? "N/A"
                                                }
                                            >
                                                <option value="N/A">N/A</option>
                                                <option value="9"> 9 </option>
                                                <option value="10"> 10 </option>
                                                <option value="11"> 11 </option>
                                                <option value="12"> 12 </option>
                                            </select>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap w-1/5">
                                        {subordinate.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium w-1/12">
                                        <button
                                            onClick={() =>
                                                onDelete(subordinate.id)
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 inline-block fill-red-500 hover:fill-red-900 focus:outline-none"
                                                viewBox="0 0 24 24"
                                            >
                                                <title>trash-can</title>
                                                <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <Notifications
                generated={generated}
                copied={copied}
                setGenerated={setGenerated}
                setCopied={setCopied}
            />
        </>
    );
}
