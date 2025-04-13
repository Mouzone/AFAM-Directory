import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Staff, StaffObject } from "../types";

export const getStaff = async (directoryId: string) => {
    const staffCollectionRef = collection(
        db,
        "directory",
        directoryId,
        "staff"
    );
    const staffDocs = await getDocs(staffCollectionRef);

    const staff: StaffObject = {};
    staffDocs.docs.forEach(
        (staffDoc) => (staff[staffDoc.id] = staffDoc.data() as Staff)
    );
    return staff;
};
