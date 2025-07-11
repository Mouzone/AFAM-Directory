import formatPhoneNumber from "@/utility/formatters/formatPhone";
import { StudentPrivateInfo } from "@/utility/types";
import React, { SetStateAction } from "react";
import TextInput from "@/components/Inputs/TextInput";
import GuardianFieldset from "@/components/Fieldsets/GuardianFieldset";
import AddressFieldset from "@/components/Fieldsets/AddressFieldset";

type PrivateSubFormProps = {
	data: StudentPrivateInfo;
	setPrivateFormData: React.Dispatch<SetStateAction<StudentPrivateInfo>>;
};

export default function PrivateSubForm({
	data,
	setPrivateFormData,
}: PrivateSubFormProps) {
	const changeData = (
		person: "Personal" | "Guardian 1" | "Guardian 2",
		field: string,
		value: string
	) => {
		setPrivateFormData((prev) => {
			return {
				Personal: {
					...prev["Personal"],
				},
				"Guardian 1": {
					...prev["Guardian 1"],
				},
				"Guardian 2": {
					...prev["Guardian 2"],
				},
				[person]: {
					...prev[person],
					[field]: value,
				},
			};
		});
	};

	return (
		<>
			<AddressFieldset
				data={data["Personal"]}
				changeData={(
					field: keyof StudentPrivateInfo["Personal"],
					value: string
				) =>
					setPrivateFormData((prev) => {
						return {
							Personal: {
								...prev["Personal"],
								[field]: value,
							},
							"Guardian 1": {
								...prev["Guardian 1"],
							},
							"Guardian 2": {
								...prev["Guardian 2"],
							},
						};
					})
				}
			/>

			<fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box flex gap-4">
				<legend className="fieldset-legend">
					Personal Contact Info
				</legend>

				<TextInput
					label="Phone"
					data={formatPhoneNumber(data["Personal"]["Phone"])}
					setData={(e) =>
						changeData("Personal", "Phone", e.target.value)
					}
					isMandatory={true}
				/>

				<TextInput
					label="Email"
					data={data["Personal"]["Email"]}
					setData={(e) =>
						changeData("Personal", "Email", e.target.value)
					}
					isMandatory={true}
				/>
			</fieldset>

			<GuardianFieldset
				label="Guardian 1"
				data={data["Guardian 1"]}
				changeData={changeData}
				isMandatory={true}
			/>
			<GuardianFieldset
				label="Guardian 2"
				data={data["Guardian 2"]}
				changeData={changeData}
				isMandatory={false}
			/>
		</>
	);
}
