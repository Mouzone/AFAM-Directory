import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getStaff = async (directoryId: string) => {
    const staffCollectionRef = collection(
        db,
        "directory",
        directoryId,
        "staff"
    );
    const staffDocs = await getDocs(staffCollectionRef);

    const staff = {};
    staffDocs.docs.forEach(
        (staffDoc) => (staff[staffDoc.id] = staffDoc.data())
    );
    console.log(staff);
    return staff;
};
