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
        "Street Address": "";
        City: "";
        "Zip Code": "";
        Phone: "";
        Email: "";
    };
    "Guardian 1": { "First Name": ""; "Last Name": ""; Phone: ""; Email: "" };
    "Guardian 2": { "First Name": ""; "Last Name": ""; Phone: ""; Email: "" };
};

export type Staff = {
    "First Name": string;
    "Last Name": string;
    Email: string;
    Private: boolean;
    "Manage Accounts": boolean;
};

export type StaffObject = { [key: string]: Staff };
