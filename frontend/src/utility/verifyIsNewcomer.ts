// calculate if the student joined in the past month

export default function verifyIsNewcomer(joinDate: Date) {
	const todayDate = new Date();
	const yearDiff = todayDate.getFullYear() - joinDate.getFullYear();
	const monthDiff = todayDate.getMonth() - joinDate.getMonth();
	if (yearDiff === 0) {
		// Same year
		if (monthDiff <= 1) {
			// Same month, so difference is definitely less than a month
			// ignore if the dates are not close by, if the months are next to each other then its fine
			return true;
		} else {
			// More than one month difference
			return false;
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
	return;
}
