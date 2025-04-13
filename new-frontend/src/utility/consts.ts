import { StudentGeneralInfo } from "./types";

export const generalFormDataDefault = {
    "Headshot URL": "",
    "First Name": "",
    "Last Name": "",
    Gender: "M",
    Birthday: new Date().toISOString().split("T")[0],
    "High School": "",
    Grade: "9",
    Teacher: "None",
} as StudentGeneralInfo;

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

export const schema = Object.keys(generalFormDataDefault).filter(
    (key) => key !== "Headshot URL"
) as (keyof StudentGeneralInfo)[];
