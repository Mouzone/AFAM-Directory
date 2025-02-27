import { StudentGeneralInfo, StudentPrivateInfo } from "../types";

export const studentGeneralInfoDefault = {
    firstName: "",
    lastName: "",
    schoolYear: "",
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
} as StudentPrivateInfo

export const labels = {
    firstName: "First Name",
    lastName: "Last Name",
    schoolYear: "Grade",
    teacher: "Teacher",
} as const;
