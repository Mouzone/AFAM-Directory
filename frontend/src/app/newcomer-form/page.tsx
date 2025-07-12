"use client";
import { FormEvent, useRef, useState } from "react";
import {
	generalFormDataDefault,
	privateFormDataDefault,
} from "@/utility/consts";
import { StudentGeneralInfo, StudentPrivateInfo } from "@/utility/types";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/utility/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ProfilePicFieldset from "@/components/Fieldsets/ProfilePicFieldset";
import GeneralFieldset from "@/components/Fieldsets/GeneralFieldset";
import AddressFieldset from "@/components/Fieldsets/AddressFieldset";
import PersonalContactFieldset from "@/components/Fieldsets/PersonalContactFieldset";
import GuardianFieldset from "@/components/Fieldsets/GuardianFieldset";
import { Guardian } from "@/utility/types";
import validateNewcomerForm from "@/utility/validateNewcomerForm";

export default function Page() {
	const [page, setPage] = useState(1);
	const [generalFormData, setGeneralFormData] = useState(
		generalFormDataDefault
	);
	const [privateFormData, setPrivateFormData] = useState<StudentPrivateInfo>(
		privateFormDataDefault
	);
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [resetCounter, setResetCounter] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isError, setIsError] = useState(false);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Create new student

		const newStudentRef = await addDoc(
			collection(db, "directory", "afam", "student"),
			generalFormData
		);

		try {
			await updateDoc(newStudentRef, { Id: newStudentRef.id });
			await setDoc(
				doc(newStudentRef, "private", "data"),
				privateFormData
			);

			if (file) {
				const storageRef = ref(storage, `images/${newStudentRef.id}`);
				const uploadTask = uploadBytesResumable(storageRef, file);
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Track upload progress (optional)
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) *
							100;
						console.log(`Upload progress: ${progress}%`);
					},
					(error) => {
						console.error("Upload failed:", error);
					},
					async () => {
						// Upload completed: Get the public URL
						const downloadURL = await getDownloadURL(
							uploadTask.snapshot.ref
						);

						// Store the URL in your form data
						generalFormData["Headshot URL"] = downloadURL;
						await updateDoc(newStudentRef, {
							"Headshot URL": downloadURL,
						});
					}
				);
			}
			setIsSubmitting(false);
			setIsSubmitted(true);
		} catch {
			setIsSubmitting(false);
			setIsSubmitted(true);
			setIsError(true);
		}
	};

	const changeGeneralData = (
		field: keyof StudentGeneralInfo,
		value: string | number | string[]
	) =>
		setGeneralFormData((prev) => {
			return { ...prev, [field]: value };
		});

	const changePersonalData = (
		field: keyof StudentPrivateInfo["Personal"],
		value: string | number | string[]
	) =>
		setPrivateFormData((prev) => {
			return {
				...prev,
				Personal: { ...prev["Personal"], [field]: value },
			};
		});

	const changePrivateData = (
		label: "Personal" | "Guardian 1" | "Guardian 2",
		field: keyof Guardian,
		value: string
	) =>
		setPrivateFormData((prev) => {
			return {
				...prev,
				[label]: { ...prev[label], [field]: value },
			};
		});

	if (page < 1 || page > 4) {
		setPage(1);
	}

	let isSectionComplete = false;
	function isValidPageNumber(value: number): value is 1 | 2 | 3 | 4 {
		return value === 1 || value === 2 || value === 3 || value === 4;
	}
	if (isValidPageNumber(page)) {
		isSectionComplete = validateNewcomerForm(
			page,
			generalFormData,
			privateFormData
		);
	} else {
		console.warn("Invalid page number detected:", page);
		isSectionComplete = false;
	}
	console.log(isSectionComplete);
	return (
		<>
			{isSubmitted ? (
				<div className="flex items-center justify-center h-screen w-full">
					{isSubmitted && !isError && (
						<div>Success! You can close this tab now.</div>
					)}

					{isError && (
						<div>
							Error. Notify Pastor Sang or Miss Rachael about the
							error
						</div>
					)}
				</div>
			) : (
				<form
					onSubmit={(e) => onSubmit(e)}
					className="w-md flex flex-col justify-center"
				>
					{page === 1 && (
						<ProfilePicFieldset
							fileInputRef={fileInputRef}
							setFile={setFile}
							changeData={changeGeneralData}
							url={generalFormData["Headshot URL"]}
						/>
					)}

					{page === 2 && (
						<GeneralFieldset
							data={generalFormData}
							changeData={changeGeneralData}
							resetCounter={resetCounter}
						/>
					)}

					{page === 3 && (
						<>
							<AddressFieldset
								data={privateFormData["Personal"]}
								changeData={changePersonalData}
							/>
							<PersonalContactFieldset
								data={privateFormData["Personal"]}
								changeData={changePersonalData}
							/>
						</>
					)}

					{page === 4 && (
						<>
							<GuardianFieldset
								label="Guardian 1"
								data={privateFormData["Guardian 1"]}
								changeData={changePrivateData}
								isMandatory={true}
							/>
							<GuardianFieldset
								label="Guardian 2"
								data={privateFormData["Guardian 2"]}
								changeData={changePrivateData}
								isMandatory={false}
							/>
						</>
					)}

					<div className="flex justify-between mt-5">
						<button
							type="button"
							className="btn btn-neutral dark:btn-secondary"
							onClick={() => setPage((prev) => prev - 1)}
							disabled={page === 1}
						>
							Prev
						</button>
						{page === 4 ? (
							<button
								type="submit"
								className="btn btn-primary dark:btn-secondary"
								disabled={!isSectionComplete}
								onClick={() => setIsSubmitting(true)}
							>
								{isSubmitting ? (
									<span className="loading loading-spinner loading-sm"></span>
								) : (
									"Submit"
								)}
							</button>
						) : (
							<button
								type="button"
								className="btn btn-neutral dark:btn-secondary"
								onClick={() => setPage((prev) => prev + 1)}
								disabled={!isSectionComplete}
							>
								Next
							</button>
						)}
					</div>
				</form>
			)}
		</>
	);
}
