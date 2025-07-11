import AllergyInput from "@/components/Inputs/AllergyInput";
import MandatoryIndicator from "@/components/Minor/MandatoryIndicator";
import formatText from "@/utility/formatters/formatText";
import { StudentGeneralInfo } from "@/utility/types";
import Image from "next/image";
import { join } from "path";
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
		value: string | number
	) => {
		setGeneralFormData((prev) => {
			return {
				...prev,
				[field]: value,
			};
		});
	};

	// calculate if the student joined in the past month
	const joinDate = new Date(data["First Time"]);
	const todayDate = new Date();
	const yearDiff = todayDate.getFullYear() - joinDate.getFullYear();
	const monthDiff = todayDate.getMonth() - joinDate.getMonth();
	let isNewcomer = false;
	if (yearDiff === 0) {
		// Same year
		if (monthDiff === 0) {
			// Same month, so difference is definitely less than a month
			isNewcomer = true;
		} else {
			// More than one month difference
			isNewcomer = false;
		}
	} else if (yearDiff === 1) {
		// One year difference, check if it spans across the new year to be less than a month
		if (joinDate.getMonth() === 11 && todayDate.getMonth() === 0) {
			// Dec to Jan
			return todayDate.getDate() <= joinDate.getDate();
		} else {
			return false;
		}
	} else {
		// More than one year difference
		return false;
	}
	return (
		<>
			<fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box flex flex-col">
				<legend className="fieldset-legend">Image</legend>
				<div className="flex justify-center">
					<input
						ref={fileInputRef}
						type="file"
						className="file-input file-input-sm"
						onChange={(e) => {
							const file = e.target?.files?.[0];
							if (file) {
								setFile(file);
								const reader = new FileReader();
								reader.onload = (event) => {
									const url = event.target?.result ?? "";
									changeData("Headshot URL", url as string);
								};
								reader.readAsDataURL(file);
							}
						}}
						accept="image/*"
					/>
				</div>

				{data["Headshot URL"] !== "" && (
					<Image
						src={data["Headshot URL"]}
						alt="image"
						width={800}
						height={500}
					/>
				)}
			</fieldset>
			<fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box">
				<legend className="fieldset-legend">General</legend>

				<div className="flex gap-4">
					<div className="flex flex-col">
						<label className="fieldset-label">
							<div className="flex">
								First Name
								<MandatoryIndicator />
							</div>
						</label>
						<input
							type="text"
							className="input"
							value={formatText(data["First Name"])}
							onChange={(e) =>
								changeData("First Name", e.target.value)
							}
						/>
					</div>
					<div className="flex flex-col">
						<label className="fieldset-label">
							<div className="flex">
								Last Name
								<MandatoryIndicator />
							</div>
						</label>
						<input
							type="text"
							className="input"
							value={formatText(data["Last Name"])}
							onChange={(e) =>
								changeData("Last Name", e.target.value)
							}
						/>
					</div>
				</div>

				<div className="flex flex-wrap gap-4">
					<div className="flex flex-col flex-1 min-w-[calc(50%-0.5rem)]">
						<label className="fieldset-label">
							<div className="flex">
								High School
								<MandatoryIndicator />
							</div>
						</label>
						<input
							type="text"
							className="input"
							value={formatText(data["High School"])}
							onChange={(e) =>
								changeData("High School", e.target.value)
							}
						/>
					</div>
					<div className="flex flex-col flex-1 min-w-[calc(50%-0.5rem)]">
						<label className="fieldset-label">
							<div className="flex">
								Grade
								<MandatoryIndicator />
							</div>
						</label>
						<select
							className="select"
							value={String(data["Grade"])}
							onChange={(e) =>
								changeData("Grade", parseInt(e.target.value))
							}
						>
							<option value={9}>9</option>
							<option value={10}>10</option>
							<option value={11}>11</option>
							<option value={12}>12</option>
						</select>
					</div>
					<div className="flex flex-col flex-1 min-w-full">
						<label className="fieldset-label">
							Bible Study Teacher (if assigned)
						</label>
						<select
							className="select"
							value={data["Teacher"]}
							onChange={(e) =>
								changeData("Teacher", e.target.value)
							}
						>
							<option>Anna Kwon</option>
							<option>Chloe Han</option>
							<option>Diane Song</option>
							<option>Josephine Lee</option>
							<option>Joshua Lee</option>
							<option>JY Kim</option>
							<option>Karen Park</option>
							<option>Matt Yoon</option>
							<option>Rachael Park</option>
							<option>Shany Park</option>
							<option>Sol Park</option>
							<option>None</option>
						</select>
					</div>
				</div>

				<div className="flex gap-1">
					<div className="flex flex-col">
						<label className="fieldset-label">
							<div className="flex">
								Gender
								<MandatoryIndicator />
							</div>
						</label>
						<select
							className="select"
							value={data["Gender"]}
							onChange={(e) =>
								changeData("Gender", e.target.value)
							}
						>
							<option value="M">Male</option>
							<option value="F">Female</option>
						</select>
					</div>

					<div className="flex flex-col">
						<label className="fieldset-label">
							<div className="flex">
								Birthday
								<MandatoryIndicator />
							</div>
						</label>
						<input
							type="date"
							className="input"
							value={data["Birthday"]}
							onChange={(e) =>
								changeData("Birthday", e.target.value)
							}
						/>
					</div>
					<div className="flex flex-col">
						<label className="fieldset-label">
							<div className="flex">
								First time AFAM?
								<MandatoryIndicator />
							</div>
						</label>
						<select
							value={isNewcomer ? "Yes" : "No"}
							onChange={(e) => {
								changeData(
									"First Time",
									e.target.value === "Yes"
										? new Date().toISOString().split("T")[0]
										: data["First Time"]
								);
							}}
							className="select"
						>
							<option value={"Yes"}>Yes</option>
							<option value={"No"}>No</option>
						</select>
					</div>
				</div>
				<AllergyInput
					allergies={data["Allergies"]}
					setAllergies={(allergy: string[]) =>
						setGeneralFormData((prev) => {
							return {
								...prev,
								Allergies: allergy,
							};
						})
					}
					resetCounter={resetCounter}
				/>
			</fieldset>
		</>
	);
}
