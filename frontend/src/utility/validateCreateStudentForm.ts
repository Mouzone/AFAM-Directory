import { StudentGeneralInfo, StudentPrivateInfo } from "./types";

export default function validateCreateStudentForm(
    generalFormData: StudentGeneralInfo,
    privateFormData: StudentPrivateInfo
) {
    // make sure all fields of generalFormData are filled
    // make sure all fields of personal in privateFormData are filled
    // make sure all fields of either guardian1 or guardian2 are filled
    return (
        noEmptyStrings(generalFormData) &&
        noEmptyStrings(privateFormData["Personal"]) &&
        (noEmptyStrings(privateFormData["Guardian 1"]) ||
            noEmptyStrings(privateFormData["Guardian 2"]))
    );
}

function noEmptyStrings(obj: { [key: string]: string }) {
    for (const value of Object.values(obj)) {
        if (value === "") {
            return false;
        }
    }
    return true;
}
