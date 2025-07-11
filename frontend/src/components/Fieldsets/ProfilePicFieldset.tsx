import Image from "next/image";
import { StudentGeneralInfo } from "@/utility/types";

type ProfilePicFieldsetProps = {
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	setFile: (value: React.SetStateAction<File | null>) => void;
	changeData: (
		field: keyof StudentGeneralInfo,
		value: string | number
	) => void;
	url: string;
};
export default function ProfilePicFieldset({
	fileInputRef,
	setFile,
	changeData,
	url,
}: ProfilePicFieldsetProps) {
	return (
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

			{url !== "" && (
				<Image
					src={url}
					alt="image"
					width={800}
					height={500}
				/>
			)}
		</fieldset>
	);
}
