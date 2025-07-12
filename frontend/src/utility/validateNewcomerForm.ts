import { StudentGeneralInfo, StudentPrivateInfo } from "./types";

type GeneralFieldKey = keyof StudentGeneralInfo;
type PersonalFieldKey = keyof StudentPrivateInfo["Personal"];
type GuardianFieldKey = keyof StudentPrivateInfo["Guardian 1"];

const mandatoryFields: {
	1: [];
	2: GeneralFieldKey[];
	3: PersonalFieldKey[];
	4: GuardianFieldKey[];
} = {
	1: [],
	2: [
		"First Name",
		"Last Name",
		"High School",
		"Grade",
		"Gender",
		"Birthday",
		"First Time",
	],
	3: ["Street Address", "City", "Zip Code", "Phone", "Email"],
	4: ["First Name", "Last Name", "Phone", "Email"],
};

export default function validateNewcomerForm(
	page: keyof typeof mandatoryFields,
	generalFormData: StudentGeneralInfo,
	privateFormData: StudentPrivateInfo
) {
	const fieldsToValidate = mandatoryFields[page];

	if (fieldsToValidate.length === 0) {
		return true;
	}

	return fieldsToValidate.every((field) => {
		if (page === 2) {
			return generalFormData[field as GeneralFieldKey] !== "";
		} else if (page === 3) {
			return (
				privateFormData["Personal"][field as PersonalFieldKey] !== ""
			);
		} else if (page === 4) {
			return (
				privateFormData["Guardian 1"][field as GuardianFieldKey] !== ""
			);
		}

		return true;
	});
}
