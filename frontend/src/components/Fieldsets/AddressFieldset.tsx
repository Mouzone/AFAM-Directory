import { StudentPrivateInfo } from "@/utility/types";
import TextInput from "../Inputs/TextInput";

type AddressFieldsetProps = {
	data: StudentPrivateInfo["Personal"];
	changeData: (
		field: keyof StudentPrivateInfo["Personal"],
		value: string
	) => void;
};
export default function AddressFieldset({
	data,
	changeData,
}: AddressFieldsetProps) {
	return (
		<fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box flex flex-col">
			<legend className="fieldset-legend">Address</legend>
			<TextInput
				label={"Street Address"}
				data={data["Street Address"]}
				setData={(e) => changeData("Street Address", e.target.value)}
				isMandatory={true}
			/>
			<div className="flex gap-4">
				<TextInput
					label="City"
					data={data["City"]}
					setData={(e) => changeData("City", e.target.value)}
					isMandatory={true}
				/>
				<TextInput
					label="Zip Code"
					data={data["Zip Code"]}
					setData={(e) => {
						const value = e.target.value;
						if (/^\d{0,5}$/.test(value)) {
							changeData("Zip Code", value);
						}
					}}
					isMandatory={true}
				/>
			</div>
		</fieldset>
	);
}
