import { User } from "firebase/auth";

export type Directory = {
    id: string;
    name: string;
    owner: string;
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
