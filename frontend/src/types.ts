import { labels } from "./utility/consts"
export type student = {
    id?: string,
    firstName: string,
    lastName: string,
    schoolYear: "9" | "10" | "11" | "12",
    dob: string,
    gender: "Male" | "Female",
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
        phoneNumer: string,
        email: string,
    },
    teacher: {
        firstName: string,
        lastName: string
    }
}

export type LabelsKey = keyof typeof labels
