import GeneralFieldset from "@/components/Fieldsets/GeneralFieldset";
import ProfilePicFieldset from "@/components/Fieldsets/ProfilePicFieldset";
import AllergyInput from "@/components/Inputs/AllergyInput";
import MandatoryIndicator from "@/components/Minor/MandatoryIndicator";
import formatText from "@/utility/formatters/formatText";
import { StudentGeneralInfo } from "@/utility/types";
import verifyIsNewcomer from "@/utility/verifyIsNewcomer";
import Image from "next/image";
import React, { RefObject, SetStateAction } from "react";

type GeneralSubFormProps = {
	data: StudentGeneralInfo;
	setGeneralFormData: React.Dispatch<SetStateAction<StudentGeneralInfo>>;
	setFile: React.Dispatch<SetStateAction<File | null>>;
	fileInputRef: RefObject<null | HTMLInputElement>;
	resetCounter: number;
};
export default function GeneralSubForm({
	data,
	setGeneralFormData,
	setFile,
	fileInputRef,
	resetCounter,
}: GeneralSubFormProps) {
	const currentYear = new Date().getFullYear();
	const years = [];
	for (let i = 0; i < 5; i++) {
		years.push(currentYear - i);
	}
	const changeData = (
		field: keyof StudentGeneralInfo,
		value: string | number | string[]
	) => {
		setGeneralFormData((prev) => {
			return {
				...prev,
				[field]: value,
			};
		});
	};

	return (
		<>
			<ProfilePicFieldset
				fileInputRef={fileInputRef}
				setFile={setFile}
				changeData={changeData}
				url={data["Headshot URL"]}
			/>
			<GeneralFieldset
				data={data}
				changeData={changeData}
				resetCounter={resetCounter}
			/>
		</>
	);
}
