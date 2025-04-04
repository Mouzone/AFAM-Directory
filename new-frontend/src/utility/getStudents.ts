import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getDirectory = async (selectedDirectory: string) => {
    const directoryMetaData = await getDoc(
        doc(db, "directories", selectedDirectory)
    );
    const studentDocs = await getDocs(
        collection(db, "directories", selectedDirectory, "people")
    );

    return {
        metadata: directoryMetaData.data(),
        data: studentDocs.docs.map((studentDoc) => {
            return { ...studentDoc.data(), id: studentDoc.id };
        }),
    };
};
