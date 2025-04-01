import { User } from "firebase/auth";

export type Directory = {
    id: string;
    name: string;
};

export type LoadingUser = {
    user: null;
    directories: null;
};

export type LoadedUser = {
    user: User;
    directories: Directory[];
};

export type LoggedOutUser = {
    user: false;
    directories: null;
};
