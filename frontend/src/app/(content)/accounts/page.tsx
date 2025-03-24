"use client";

import { ChangeEvent, useContext, useEffect, useState } from "react";
import { db } from "@/utility/firebase";
import { useRouter } from "next/navigation";
import { GenerateInviteResponse, Role, Subordinate } from "@/types";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import {
    deleteUser,
    generateInviteToken,
    toggleWelcomeTeamLeader,
} from "@/utility/cloud-functions";
import { HttpsCallableResult } from "firebase/functions";
import Notifications from "@/components/AccountsComponents/Notifications";
import { AuthContext } from "@/components/AuthContext";

export default function Page() {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    const [roleToCreate, setRoleToCreate] = useState<Role>("student");
    const [email, setEmail] = useState("");
    const [invitableRoles, setInvitableRoles] = useState<Role[] | null>(null);
    const [subordinates, setSubordinates] = useState<Subordinate[]>([]);

    const [sent, setSent] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [roleToFilter, setRoleToFilter] = useState<
        Role | "" | "welcome team leader"
    >("");

    useEffect(() => {
        // checks if user is false
        if (!user) {
            router.push("/");
        }
    }, [user, router]);

    useEffect(() => {
        if (!user) return;

        const role = user.role;
        const isWelcomeTeamLeader = user.isWelcomeTeamLeader || false;

        const fetchInvitableRoles = async () => {
            if (role === "admin" || role === "pastor") {
                try {
                    const docSnap = await getDoc(doc(db, "privileges", role));
                    if (docSnap.exists()) {
                        setInvitableRoles(docSnap.data().canInvite || []); // Handle undefined canInvite
                    } else {
                        console.error(
                            "Privileges document not found for role:",
                            role
                        );
                        setInvitableRoles([]); // Set to empty array to avoid issues
                    }
                } catch (error) {
                    console.error("Error fetching invitable roles:", error);
                    setInvitableRoles([]); // Set to empty array on error
                }
            } else if (isWelcomeTeamLeader) {
                setInvitableRoles(["student"]);
            }
        };

        const fetchSubordinates = async () => {
            const subordinates: Subordinate[] = [];
            const rolesToFetch = []; // Use a Set to avoid duplicate roles

            if (role === "admin" || role === "pastor" || isWelcomeTeamLeader) {
                rolesToFetch.push("student");
            }
            if (role === "admin" || role === "pastor") {
                rolesToFetch.push("deacon");
                rolesToFetch.push("teacher");
            }
            if (role === "admin") {
                rolesToFetch.push("pastor");
            }

            for (const roleToFetch of rolesToFetch) {
                try {
                    const snapshot = await getDocs(
                        collection(db, "organization", "roles", roleToFetch)
                    );
                    snapshot.forEach((docSnap) => {
                        subordinates.push({
                            ...docSnap.data(),
                            id: docSnap.id,
                            role: roleToFetch,
                        } as Subordinate);
                    });
                } catch (error) {
                    console.error(
                        `Error fetching subordinates for role ${roleToFetch}:`,
                        error
                    );
                }
            }
            setSubordinates(subordinates);
        };

        fetchInvitableRoles();
        fetchSubordinates();
    }, [user]);

    const onSend = async () => {
        try {
            const response = await generateInviteToken({
                role: roleToCreate,
                email,
            });
            // check resposne first before setGenerate(true)
            setSent(true);
        } catch (e) {
            console.log(e);
        }
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

    const changeGrade = async (
        e: ChangeEvent<HTMLSelectElement>,
        teacherId: string
    ) => {
        const newSubordinates = subordinates.map((subordinate) =>
            subordinate.id === teacherId
                ? { ...subordinate, grade: e.target.value }
                : { ...subordinate }
        );
        setSubordinates([...newSubordinates]);

        const docRef = doc(db, `organization/roles/teacher/`, teacherId);
        await updateDoc(docRef, { grade: e.target.value });
    };

    const toggleIsWelcomeTeamLeader = async (uid: string) => {
        const newSubordinates = subordinates.map((subordinate) =>
            subordinate.id === uid
                ? {
                      ...subordinate,
                      isWelcomeTeamLeader: !subordinate.isWelcomeTeamLeader,
                  }
                : { ...subordinate }
        );
        setSubordinates([...newSubordinates]);
        await toggleWelcomeTeamLeader({ uid });
    };

    if (user === null) {
        return <div> Loading... </div>;
    }

    if (!invitableRoles) {
        return <div>Loading roles...</div>; // Show loading while fetching roles
    }

    // todo: add Welcome Team Leader to filter, and when selected we find where it is true in the field
    const subordinatesToShow = subordinates.filter((subordinate) => {
        return (
            (roleToFilter === "" ||
                subordinate.role === roleToFilter ||
                (roleToFilter == "welcome team leader" &&
                    subordinate.isWelcomeTeamLeader)) &&
            (firstName === "" || subordinate.firstName?.includes(firstName)) &&
            (lastName === "" || subordinate.lastName?.includes(lastName))
        );
    });

    return (
        <>
            <div className="flex flex-col md:flex-row justify-center gap-4 items-center">
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
                <input
                    className="w-full md:w-60 truncate border rounded p-2 break-all bg-gray-100 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    type="button"
                    onClick={onSend}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md transition-colors duration-200"
                >
                    Send
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
                    {(roleToFilter == "admin" || roleToFilter == "pastor") && (
                        <option value="welcome team leader">
                            welcome team leader
                        </option>
                    )}
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
                            {(roleToFilter == "teacher" ||
                                roleToFilter == "deacon") && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                    Welcome Team Leader
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
                                                onChange={(e) =>
                                                    changeGrade(
                                                        e,
                                                        subordinate.id
                                                    )
                                                }
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
                                    {(roleToFilter == "teacher" ||
                                        roleToFilter == "deacon") &&
                                        (subordinate.role == "teacher" ||
                                            subordinate.role == "deacon") && (
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        subordinate.isWelcomeTeamLeader
                                                    }
                                                    onChange={() =>
                                                        toggleIsWelcomeTeamLeader(
                                                            subordinate.id
                                                        )
                                                    }
                                                />
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
            <Notifications email={email} sent={sent} setSent={setSent} />
        </>
    );
}
