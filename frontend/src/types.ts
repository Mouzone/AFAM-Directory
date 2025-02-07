import { labels } from "./utility/consts"
import { User } from "firebase/auth"

export type Student = {
    id?: string,
    firstName: string,
    lastName: string,
    schoolYear: "" | "9" | "10" | "11" | "12",
    dob: string,
    gender: "" | "Male" | "Female",
    highSchool: string,
    phoneNumber: string,
    email: string,
    allergies: string[],
    home: {
        streetAddress: string,
        city: string,
        zipCode: string,
    },
    guardian1: {
        firstName: string,
        lastName: string,
        phoneNumber: string,
        email: string,
    },
    guardian2: {
        firstName: string,
        lastName: string,
        phoneNumber: string,
        email: string,
    },
    teacher: {
        firstName: string,
        lastName: string
    }
}

export type HomeKeys = keyof Student["home"]
export type GuardianKeys = keyof Student["guardian1"]

export type Teacher = {
    firstName: string,
    lastName: string,
    grade: "9" | "10" | "11" | "12"
}

export type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
};

export type LabelsKey = keyof typeof labels
