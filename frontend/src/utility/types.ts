import { User } from "firebase/auth";

export type AccountInfo = {
    Email: string;
    "First Name": string;
    "Last Name": string;
    Private: boolean;
    "Manage Accounts": boolean;
};

// loading, loaded, logged out / error
export type AuthUser = null | User | false;
export type Grade = 9 | 10 | 11 | 12;

export type StudentGeneralInfo = {
    Id: string;
    "Headshot URL": string;
    "First Name": string;
    "Last Name": string;
    Gender: "M" | "F";
    Birthday: string;
    "High School": string;
    Grade: Grade;
    Teacher: "None" | string;
    Allergies: string[];
    "First Time"?: boolean;
};

export type Guardian = {
    "First Name": string;
    "Last Name": string;
    Phone: string;
    Email: string;
};
export type StudentPrivateInfo = {
    Personal: {
        "Street Address": string;
        City: string;
        "Zip Code": string;
        Phone: string;
        Email: string;
    };
    "Guardian 1": Guardian;
    "Guardian 2": Guardian;
};

export type Attendance = {
    "Sermon Attendance": boolean;
    "Class Attendance": boolean;
};

export type AttendanceObject = { [key: string]: Attendance };

export type Staff = {
    "First Name": string;
    "Last Name": string;
    Email: string;
    Private: boolean;
    "Manage Accounts": boolean;
};

export type StaffObject = { [key: string]: Staff };

export type SearchTerms = {
    "First Name": string;
    "Last Name": string;
    Gender: "M" | "F";
    "High School": string;
    Grade: "9" | "10" | "11" | "!2";
    Teacher: "None" | string;
};

export type ToastContextType = {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
};
