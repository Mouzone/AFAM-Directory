import verifyIsNewcomer from "@/utility/verifyIsNewcomer";
import MandatoryIndicator from "../Minor/MandatoryIndicator";
import formatText from "@/utility/formatters/formatText";
import { StudentGeneralInfo } from "@/utility/types";
import AllergyInput from "../Inputs/AllergyInput";

type GeneralFieldsetProps = {
	data: StudentGeneralInfo;
	changeData: (
		field: keyof StudentGeneralInfo,
		value: string | number | string[]
	) => void;
	resetCounter: number;
	setAllergies: (allergy: string[]) => void;
};
export default function GeneralFieldset({
	data,
	changeData,
	resetCounter,
	setAllergies,
}: GeneralFieldsetProps) {
	const joinDate = new Date(data["First Time"]);
	const isNewcomer = verifyIsNewcomer(joinDate);
	return (
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
						onChange={(e) => changeData("Teacher", e.target.value)}
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
						onChange={(e) => changeData("Gender", e.target.value)}
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
						onChange={(e) => changeData("Birthday", e.target.value)}
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
									: "2001-01-01"
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
					changeData("Allergies", allergy)
				}
				resetCounter={resetCounter}
			/>
		</fieldset>
	);
}
