export default function formatPhoneNumber(phoneNumber: string) {
    // Remove any non-digit characters
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");

    // Break into parts and join with hyphens
    const parts = [];

    // Add first 3 digits if they exist
    if (cleaned.length > 0) {
        parts.push(cleaned.substring(0, 3));
    }

    // Add next 3 digits if they exist
    if (cleaned.length > 3) {
        parts.push(cleaned.substring(3, 6));
    }

    // Add remaining digits (no limit)
    if (cleaned.length > 6) {
        parts.push(cleaned.substring(6));
    }

    return parts.join("-");
}
