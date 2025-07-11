import formatPhoneNumber from "@/utility/formatters/formatPhone";
import TextInput from "../Inputs/TextInput";
import { StudentPrivateInfo } from "@/utility/types";

type PersonalContactFieldsetProps = {
	data: StudentPrivateInfo["Personal"];
	changeData: (
		field: keyof StudentPrivateInfo["Personal"],
		value: string
	) => void;
};

export default function PersonalContactFieldset({
	data,
	changeData,
}: PersonalContactFieldsetProps) {
	return (
		<fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box flex gap-4">
			<legend className="fieldset-legend">Personal Contact Info</legend>

			<TextInput
				label="Phone"
				data={formatPhoneNumber(data["Phone"])}
				setData={(e) => changeData("Phone", e.target.value)}
				isMandatory={true}
			/>

			<TextInput
				label="Email"
				data={data["Email"]}
				setData={(e) => changeData("Email", e.target.value)}
				isMandatory={true}
			/>
		</fieldset>
	);
}
