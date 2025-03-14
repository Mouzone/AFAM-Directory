import { labels } from "./utility/consts";

export type StudentGeneralInfo = {
    id?: string;
    firstName: string;
    lastName: string;
    highSchool: string;
    schoolYear: "" | "9" | "10" | "11" | "12";
    dob: string;
    gender: "" | "Male" | "Female";
    allergies: string[];
    teacher: {
        firstName: string;
        lastName: string;
    };
};

export type StudentPrivateInfo = {
    phoneNumber: string;
    email: string;
    home: {
        streetAddress: string;
        city: string;
        zipCode: string;
    };
    guardian1: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
    };
    guardian2: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
    };
};

export type HomeKeys = keyof StudentPrivateInfo["home"];
export type GuardianKeys = keyof StudentPrivateInfo["guardian1"];

export type Teacher = {
    id: string;
    firstName: string;
    lastName: string;
    grade?: "9" | "10" | "11" | "12" | "N/A";
};

export type LabelsKey = keyof typeof labels;

export type SearchValues = {
    firstName: string;
    lastName: string;
    schoolYear: string;
    teacher: string;
};

export type Role = "admin" | "pastor" | "teacher" | "deacon" | "student";

export interface GenerateInviteResponse {
    token: string;
}

export type Subordinate = {
    id: string;
    firstName?: string;
    lastName?: string;
    role: string;
    email?: string;
    grade?: string;
} & ({ role: "teacher" | "deacon" } extends { role: string }
    ? { isWelcomeTeamLeader?: boolean }
    : {});
