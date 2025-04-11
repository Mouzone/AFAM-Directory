export const generalFormDataDefault = {
    "Headshot URL": "",
    "First Name": "",
    "Last Name": "",
    Gender: "M",
    Birthday: new Date().toISOString().split("T")[0],
    "High School": "",
    Grade: "9",
    Teacher: "None",
};

export const privateFormDataDefault = {
    Personal: {
        "Street Address": "",
        City: "",
        "Zip Code": "",
        Phone: "",
        Email: "",
    },
    "Guardian 1": { "First Name": "", "Last Name": "", Phone: "", Email: "" },
    "Guardian 2": { "First Name": "", "Last Name": "", Phone: "", Email: "" },
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
