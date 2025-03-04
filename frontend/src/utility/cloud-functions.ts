import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const createUserWithRole = httpsCallable(functions, 'createUserWithRole');
const generateInviteLink = httpsCallable(functions, "generateInviteLink");