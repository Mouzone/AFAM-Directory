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
    primaryContact: {
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