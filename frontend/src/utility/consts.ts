import { Student } from "../types"

export const addState = {
    firstName: "",
    lastName: "",
    schoolYear: "",
    dob: "",
    gender: "",
    highSchool: "",
    phoneNumber: "",
    email: "",
    allergies: [],
    home: {
        streetAddress: "",
        city: "",
        zipCode: ""
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
    teacher: {
        firstName: "",
        lastName: ""
    }
} as Student

export const labels = {
    firstName: "First Name",
    lastName: "Last Name",
    schoolYear: "Grade",
    teacher: "Teacher",
} as const;