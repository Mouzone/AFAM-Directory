import { User } from "firebase/auth";

export type Directory = {
    id: string;
    name: string;
    Private: boolean;
    "Manage Accounts": boolean;
};

// loading, loaded, logged out / error
export type AuthUser =
    | {
          user: null;
          directories: null;
      }
    | {
          user: User;
          directories: Directory[];
      }
    | {
          user: false;
          directories: null;
      };

export type StudentGeneralInfo = {
    "Headshot URL": string;
    "First Name": string;
    "Last Name": string;
    Gender: "M" | "F";
    Birthday: string;
    "High School": string;
    Grade: "9" | "10" | "11" | "12";
    Teacher: "None" | string;
};

export type StudentGeneralInfoObject = { [key: string]: StudentGeneralInfo };

export type StudentPrivateInfo = {
    Personal: {
        "Street Address": string;
        City: string;
        "Zip Code": string;
        Phone: string;
        Email: string;
    };
    "Guardian 1": {
        "First Name": string;
        "Last Name": string;
        Phone: string;
        Email: string;
    };
    "Guardian 2": {
        "First Name": string;
        "Last Name": string;
        Phone: string;
        Email: string;
    };
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
