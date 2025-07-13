import { StudentGeneralInfo } from "./types";

export default function findCurrentWeekBirthdays(
	data: StudentGeneralInfo[]
): StudentGeneralInfo[] {
	// Use the real local date (safe from timezone bugs)
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Normalize to start of day

	const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

	// Compute Monday of this week
	const monday = new Date(today);
	const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
	monday.setDate(today.getDate() + offset);
	monday.setHours(0, 0, 0, 0);

	// Compute Sunday of this week
	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);
	sunday.setHours(23, 59, 59, 999);

	// For logging/debug:
	console.log(
		`Week range: ${monday.toDateString()} to ${sunday.toDateString()}`
	);

	// Filter students with birthdays falling in this week (month/day only)
	const filtered = data.filter((student) => {
		const [_, monthStr, dayStr] = student.Birthday.split("-");
		const month = parseInt(monthStr, 10) - 1; // 0-based
		const day = parseInt(dayStr, 10);

		// Create birthday in current year
		const birthdayThisYear = new Date(today.getFullYear(), month, day);
		birthdayThisYear.setHours(0, 0, 0, 0);

		return birthdayThisYear >= monday && birthdayThisYear <= sunday;
	});

	// Sort by month/day
	filtered.sort((a, b) => {
		const [_, am, ad] = a.Birthday.split("-").map(Number);
		const [__, bm, bd] = b.Birthday.split("-").map(Number);

		const da = new Date(2000, am - 1, ad);
		const db = new Date(2000, bm - 1, bd);
		return da.getTime() - db.getTime();
	});

	return filtered;
}
