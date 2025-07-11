import { StudentPrivateInfo } from "@/utility/types";
import React, { SetStateAction } from "react";
import GuardianFieldset from "@/components/Fieldsets/GuardianFieldset";
import AddressFieldset from "@/components/Fieldsets/AddressFieldset";
import PersonalContactFieldset from "@/components/Fieldsets/PersonalContactFieldset";

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

	const changePesonalData = (
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
		});

	return (
		<>
			<AddressFieldset
				data={data["Personal"]}
				changeData={changePesonalData}
			/>

			<PersonalContactFieldset
				data={data["Personal"]}
				changeData={changePesonalData}
			/>

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
