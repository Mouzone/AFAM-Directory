import { AllKeys, StudentGeneralInfo, StudentPrivateInfo } from "../types";

export const studentGeneralInfoDefault = {
    firstName: "",
    lastName: "",
    grade: "",
    dob: "",
    gender: "",
    highSchool: "",
    allergies: [],
    teacher: {
        firstName: "",
        lastName: "",
    },
} as StudentGeneralInfo;

export const studentPrivateInfoDefault = {
    phoneNumber: "",
    email: "",
    home: {
        streetAddress: "",
        city: "",
        zipCode: "",
    },
    guardian1: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
    },
    guardian2: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
    },
} as StudentPrivateInfo;

export const labels: Partial<Record<AllKeys, string>> = {
    firstName: "First Name",
    lastName: "Last Name",
    grade: "Grade",
    teacher: "Teacher",
    dob: "Birthday",
    gender: "Gender",
    highSchool: "High School",
    phoneNumber: "Phone Number",
    email: "Email",
} as const;

export const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const mandatoryGeneralDataKeys: (keyof StudentGeneralInfo)[] = [
    "firstName",
    "lastName",
    "grade",
    "dob",
    "gender",
    "highSchool",
];
export const mandatoryPrivateDataKeys: (keyof StudentPrivateInfo)[] = [
    "phoneNumber",
    "email",
];
