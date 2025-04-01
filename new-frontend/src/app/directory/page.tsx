"use client";

import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";

export default function Page() {
    const { user, directories } = useContext(AuthContext);
    if (!user) {
        return <></>;
    }
    return (
        <form>
            <input
                type="text"
                className="input"
                placeholder="Which browser do you use"
                list="browsers"
            />
            <datalist id="browsers">
                {directories.map((directory) => (
                    <option key={directory.id} value={directory.name} />
                ))}
            </datalist>
        </form>
    );
}
