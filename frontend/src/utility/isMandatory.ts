import { StudentGeneralInfo, StudentPrivateInfo } from "@/types";
import { mandatoryGeneralDataKeys, mandatoryPrivateDataKeys } from "./consts";

export default function isMandatory(name: string) {
    return (
        mandatoryGeneralDataKeys.includes(name as keyof StudentGeneralInfo) ||
        mandatoryPrivateDataKeys.includes(name as keyof StudentPrivateInfo)
    );
}
