import { StudentGeneralInfo } from "./types";

export default function findCurrentWeekBirthdays(
	data: StudentGeneralInfo[]
): StudentGeneralInfo[] {
	// Use `new Date()` for the actual current date in a production environment.
	// The date "2025-11-10" is used here for consistent testing as per your request.
	const today = new Date("2025-11-10");
	today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

	const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

	// Calculate the start of the range: Monday of the current week
	const startDate = new Date(today);
	// If today is Sunday (0), we want to go back 6 days to Monday.
	// Otherwise, go back (currentDayOfWeek - 1) days to Monday.
	startDate.setDate(
		today.getDate() - (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1)
	);
	startDate.setHours(0, 0, 0, 0); // Ensure start of day

	// Calculate the end of the range: Sunday of the current week (end of the day)
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 6); // Add 6 days to Monday to get Sunday
	endDate.setHours(23, 59, 59, 999); // Ensure end of day

	console.log(
		`Filtering range: [Inclusive: ${startDate.toDateString()}, Inclusive: ${endDate.toDateString()}]`
	);

	// Filter the data based on the calculated date range
	const filtered = data.filter((item) => {
		// Parse the "Birthday" string (e.g., "YYYY-MM-DD")
		const parts = item["Birthday"].split("-");
		if (parts.length !== 3) {
			console.warn(
				`Invalid "Birthday" format for item: ${JSON.stringify(
					item
				)}. Expected YYYY-MM-DD.`
			);
			return false;
		}

		const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed (0 for January)
		const day = parseInt(parts[2], 10);

		// To compare birthdays across years, we normalize them to the current year
		// We need to check for birthdays that fall into the *current* week,
		// which might span across the end/start of a calendar year.
		const birthdayThisYear = new Date(today.getFullYear(), month, day);
		birthdayThisYear.setHours(0, 0, 0, 0);

		const birthdayLastYear = new Date(today.getFullYear() - 1, month, day);
		birthdayLastYear.setHours(0, 0, 0, 0);

		const birthdayNextYear = new Date(today.getFullYear() + 1, month, day);
		birthdayNextYear.setHours(0, 0, 0, 0);

		// Check if any of the year-normalized birthdays fall within the inclusive range
		const isInRange =
			(birthdayThisYear >= startDate && birthdayThisYear <= endDate) ||
			(birthdayLastYear >= startDate && birthdayLastYear <= endDate) ||
			(birthdayNextYear >= startDate && birthdayNextYear <= endDate);

		return isInRange;
	});

	// Sort the filtered data by month and day in ascending order
	filtered.sort((a, b) => {
		// Create dummy dates for comparison to handle year-agnostic sorting
		const partsA = a["Birthday"].split("-");
		const monthA = parseInt(partsA[1], 10) - 1;
		const dayA = parseInt(partsA[2], 10);
		const dummyDateA = new Date(2000, monthA, dayA); // Use a common year to compare month/day

		const partsB = b["Birthday"].split("-");
		const monthB = parseInt(partsB[1], 10) - 1;
		const dayB = parseInt(partsB[2], 10);
		const dummyDateB = new Date(2000, monthB, dayB); // Use a common year to compare month/day

		return dummyDateA.getTime() - dummyDateB.getTime();
	});

	return filtered;
}
