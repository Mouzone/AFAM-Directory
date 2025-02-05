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
        phoneNumer: "",
        email: "",
    },
    teacher: {
        firstName: "",
        lastName: ""
    }
}

export const labels = {
    firstName: "First Name",
    lastName: "Last Name",
    schoolYear: "Grade",
    teacher: "Teacher",
} as const;