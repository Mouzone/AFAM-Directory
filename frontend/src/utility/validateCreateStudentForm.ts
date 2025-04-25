import { mandatoryGeneralFields } from "./consts";
import { StudentGeneralInfo, StudentPrivateInfo } from "./types";

// returns True if valid, False otherwise
export default function validateCreateStudentForm(
    generalFormData: StudentGeneralInfo,
    privateFormData: StudentPrivateInfo
) {
    const emptyGeneralFields = mandatoryGeneralFields.filter(
        (field) => generalFormData[field] === ""
    );

    console.log(emptyGeneralFields);
    return (
        emptyGeneralFields.length === 0 &&
        noEmptyStrings(privateFormData["Guardian 1"])
    );
}

// return True if no empty strings, else return False
function noEmptyStrings(obj: { [key: string]: string }) {
    for (const value of Object.values(obj)) {
        if (value === "") {
            return false;
        }
    }
    return true;
}
