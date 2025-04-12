import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getStaff = async (directoryId: string) => {
    const staffCollectionRef = collection(db, "directory", directoryId, "user");
    const staffDocs = await getDocs(staffCollectionRef);

    const staff = {};
    for (const staffDoc of staffDocs.docs) {
        staff[staffDoc.id] = staffDoc.data();
    }
    return staff;
};
