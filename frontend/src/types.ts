import { labels } from "./utility/consts";

export type Student = {
    id?: string;
    firstName: string;
    lastName: string;
    schoolYear: "" | "9" | "10" | "11" | "12";
    dob: string;
    gender: "" | "Male" | "Female";
    highSchool: string;
    phoneNumber: string;
    email: string;
    allergies: string[];
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
    teacher: {
        firstName: string;
        lastName: string;
    };
};

export type StudentKeys = keyof Student;
export type HomeKeys = keyof Student["home"];
export type GuardianKeys = keyof Student["guardian1"];

export type Teacher = {
    id: string;
    firstName: string;
    lastName: string;
    grade: "9" | "10" | "11" | "12";
};

export type LabelsKey = keyof typeof labels;

export type SearchValues = {
    firstName: string,
    lastName: string,
    schoolYear: string,
    teacher: string,
}