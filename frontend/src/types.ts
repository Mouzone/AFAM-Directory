import { labels } from "./utility/consts"
import { User } from "firebase/auth"
import { Timestamp } from "firebase/firestore"

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
    primaryContact: {
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

export type BackendStudent = Omit<Student, 'dob'> & { // Create a new type
    dob: Timestamp; // Use Timestamp for the backend
}

export type HomeKeys = keyof Student["home"]
export type PrimaryContactKeys = keyof Student["primaryContact"]

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
