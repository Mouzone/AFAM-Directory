export const generalFormDataDefault = {
    firstName: "",
    lastName: "",
    gender: "M",
    birthday: new Date().toISOString().split("T")[0],
    highSchool: "",
    grade: "9",
    teacher: "None",
};

export const privateFormDataDefault = {
    personal: {
        streetAddress: "",
        city: "",
        zipCode: "",
        phone: "",
        email: "",
    },
    guardian1: { firstName: "", lastName: "", phone: "", email: "" },
    guardian2: { firstName: "", lastName: "", phone: "", email: "" },
};

export const schema = [
    "First Name",
    "Last Name",
    "Gender",
    "Birthday",
    "High School",
    "Grade",
    "Teacher",
];
