"use client";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utility/firebase";

const getDirectories = async (user: User) => {
    const colRef = collection(db, "users", user.uid, "directories");
    const docRefs = await getDocs(colRef);
    return docRefs;
};

export default function Page() {
    // fetch all directories
    // on enter redirect to it's own directory page using the url to get the data for members, students etc.
    // or create a new one
    // wire it all up to firestore
    const { user } = useContext(AuthContext);
    const query = useQuery({
        queryKey: [user],
        queryFn: getDirectories,
    });

    return (
        <form>
            <input
                type="text"
                className="input"
                placeholder="Which browser do you use"
                list="browsers"
            />
            <datalist id="browsers">
                {query.data?.map((directory) => (
                    <option key={directory.id} value={directory.name} />
                ))}
            </datalist>
        </form>
    );
}
