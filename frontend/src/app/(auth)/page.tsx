"use client";

import LoginForm from "@/components/Forms/LoginForm";
import SignUpForm from "@/components/Forms/SignUpForm";
import { AuthContext } from "@/components/Providers/AuthProvider";
import { db } from "@/utility/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Page() {
    const user = useContext(AuthContext);
    const router = useRouter();
    useEffect(() => {
        const redirectToDirectory = async () => {
            // check if user is authenticated
            if (!user) {
                return;
            }

            const accessAFAMQuery = doc(
                db,
                "user",
                user.uid,
                "directory",
                "afam"
            );
            const accessAFAM = await getDoc(accessAFAMQuery);

            // check if user has access to afam directory
            if (accessAFAM.exists()) {
                router.push("/directory/afam");
            } else {
                router.push("/directory");
            }
        };

        redirectToDirectory();
    }, [user]);

    return (
        <div className="w-screen h-screen flex flex-col lg:flex-row justify-center items-center">
            <LoginForm />
            <div className="divider lg:divider-horizontal">OR</div>
            <SignUpForm />
        </div>
    );
}
