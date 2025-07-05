import formatText from "@/utility/formatters/formatText";
import TextInput from "../Inputs/TextInput";
import formatPhoneNumber from "@/utility/formatters/formatPhone";
import { Guardian } from "@/utility/types";

type GuardianFieldsetProps = {
    label: "Personal" | "Guardian 1" | "Guardian 2";
    data: Guardian;
    changeData: (
        label: "Personal" | "Guardian 1" | "Guardian 2",
        field: keyof Guardian,
        value: string
    ) => void;
    isMandatory: boolean;
};
export default function GuardianFieldset({
    label,
    data,
    changeData,
    isMandatory
}: GuardianFieldsetProps) {
    return (
        <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend">{label} Contact Info</legend>

            <div className="flex gap-4">
                <TextInput
                    label="First Name"
                    data={formatText(data["First Name"])}
                    setData={(e) =>
                        changeData(label, "First Name", e.target.value)
                    }
                    isMandatory={isMandatory}
                />
                <TextInput
                    label="Last Name"
                    data={formatText(data["Last Name"])}
                    setData={(e) =>
                        changeData(label, "Last Name", e.target.value)
                    }
                    isMandatory={isMandatory}
                />
            </div>
            <div className="flex gap-4">
                <TextInput
                    label="Phone"
                    data={formatPhoneNumber(data["Phone"])}
                    setData={(e) => changeData(label, "Phone", e.target.value)}
                    isMandatory={isMandatory}
                />
                <TextInput
                    label="Email"
                    data={data["Email"]}
                    setData={(e) => changeData(label, "Email", e.target.value)}
                    isMandatory={isMandatory}
                />
            </div>
        </fieldset>
    );
}
