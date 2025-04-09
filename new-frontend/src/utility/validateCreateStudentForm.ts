export default function validateCreateStudentForm(
    generalFormData,
    privateFormData
) {
    // make sure all fields of generalFormData are filled
    // make sure all fields of personal in privateFormData are filled
    // make sure all fields of either guardian1 or guardian2 are filled
    console.log(generalFormData);
    console.log(privateFormData);
    return (
        noEmptyStrings(generalFormData) &&
        noEmptyStrings(privateFormData["personal"]) &&
        (noEmptyStrings(privateFormData["guardian1"]) ||
            noEmptyStrings(privateFormData["guardian2"]))
    );
}

function noEmptyStrings(obj) {
    for (const value of Object.values(obj)) {
        if (value === "") {
            return false;
        }
    }
    return true;
}
