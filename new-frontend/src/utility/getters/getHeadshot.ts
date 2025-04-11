import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";

export const getHeadshot = async (studentId: string) => {
    const headshotRef = ref(storage, `images/${studentId}`);
    const url = await getDownloadURL(headshotRef);
    return url;
};
