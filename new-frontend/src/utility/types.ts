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
