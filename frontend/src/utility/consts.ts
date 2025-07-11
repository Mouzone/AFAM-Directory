import { StudentGeneralInfo } from "./types";

export const generalFormDataDefault = {
	Id: "",
	"Headshot URL": "",
	"First Name": "",
	"Last Name": "",
	Gender: "M",
	Birthday: new Date().toISOString().split("T")[0],
	"High School": "",
	Grade: 9,
	Teacher: "None",
	Allergies: [],
	"First Time": "2001-01-01",
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

export const mandatoryGeneralFields: (keyof StudentGeneralInfo)[] = [
	"First Name",
	"Last Name",
	"Birthday",
	"Grade",
	"Teacher",
	"High School",
	"First Time",
	"Gender",
];
