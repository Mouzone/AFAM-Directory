import { SetStateAction } from "react";
import { labels } from "./utility/consts";

export type StudentGeneralInfo = {
    id?: string;
    firstName: string;
    lastName: string;
    highSchool: string;
    grade: "" | "9" | "10" | "11" | "12";
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
export type AllKeys = keyof StudentGeneralInfo | keyof StudentPrivateInfo;

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
    grade: string;
    teacher: string;
};

export type Role = "admin" | "pastor" | "teacher" | "deacon" | "student";

export interface GenerateInviteResponse {
    token: string;
}

export type Subordinate = {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    grade?: string;
    isWelcomeTeamLeader?: boolean;
};

export interface CreateUserWithRoleResponse {
    status: number;
    message?: string;
}

export type Tab = "Directory" | "Accounts";

export type SidebarContextType = {
    currentTab: Tab;
    setCurrentTab: React.Dispatch<SetStateAction<Tab>>;
};

export type AuthUser = {
    uid: string;
    role: string;
    isWelcomeTeamLeader?: boolean;
};

export type AuthProviderType = {
    user: false | null | AuthUser;
};

export type AttendanceInfoType = {
    date?: string;
    sermonAttendance: boolean;
    classAttendance: boolean;
};
