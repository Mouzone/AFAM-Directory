import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utility/firebase";

const {
    isLoading,
    data: students,
    error,
} = useQuery({
    queryKey: [selectedDirectory, "students"],
    queryFn: () => getStudents(selectedDirectory.id),
});

const getStudents = async (selectedDirectory: string) => {
    const studentDocs = await getDocs(
        collection(db, "directories", selectedDirectory, "students")
    );
    return studentDocs.docs.map((studentDoc) => {
        return { ...studentDoc.data(), id: studentDoc.id };
    });
};
