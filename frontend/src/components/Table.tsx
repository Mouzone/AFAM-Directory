import { schema } from "@/utility/consts";
import { db } from "@/utility/firebase";
import { StudentGeneralInfo, StudentGeneralInfoObject } from "@/utility/types";
import { createColumnHelper, flexRender } from "@tanstack/react-table";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    writeBatch,
} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

type TableProps = {
    data: StudentGeneralInfoObject;
    showEditStudent: (studentId: string) => void;
    showDeleteStudents: boolean;
    setData: Dispatch<SetStateAction<StudentGeneralInfoObject>>;
};
export default function Table({
    data,
    showEditStudent,
    showDeleteStudents,
    setData,
}: TableProps) {
    const deleteStudent = async (studentId: string) => {
        const studentDocRef = doc(
            db,
            "directory",
            "afam",
            "student",
            studentId
        );
        const [privateDocs, attendanceDocs] = await Promise.all([
            getDocs(collection(studentDocRef, "private")),
            getDocs(collection(studentDocRef, "attendance")),
        ]);

        const batch = writeBatch(db);

        // Add all deletes to batch
        privateDocs.forEach((doc) => batch.delete(doc.ref));
        attendanceDocs.forEach((doc) => batch.delete(doc.ref));
        batch.delete(studentDocRef);
        await batch.commit();

        await deleteDoc(studentDocRef);
        delete data[studentId];
        setData({ ...data });
    };

    const columnHelper = createColumnHelper<StudentGeneralInfo>();

    const columns = [
        columnHelper.accessor((row) => row["First Name"], {
            id: "First Name",
            header: () => "First Name",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor((row) => row["Last Name"], {
            id: "Last Name",
            header: () => <span>Last Name</span>,
            cell: (info) => <i>{info.getValue()}</i>,
        }),
        columnHelper.accessor((row) => row["Grade"], {
            id: "Grade",
            header: () => <span>Last Name</span>,
            cell: (info) => <i>{info.getValue()}</i>,
        }),
        columnHelper.accessor((row) => row["Teacher"], {
            id: "Teacher",
            header: () => <span>Last Name</span>,
            cell: (info) => <i>{info.getValue()}</i>,
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-2">
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    {table.getFooterGroups().map((footerGroup) => (
                        <tr key={footerGroup.id}>
                            {footerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.footer,
                                              header.getContext()
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
            <div className="h-4" />
        </div>
        // <div className="overflow-x-auto">
        //     <table className="table">
        //         <thead>
        //             <tr>
        //                 {showDeleteStudents && <th></th>}
        //                 {schema.map((field) => (
        //                     <th key={field}>{field}</th>
        //                 ))}
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {Object.entries(data).map(([studentId, studentData]) => (
        //                 <tr
        //                     className="hover:bg-base-300"
        //                     key={studentId}
        //                     onClick={() => showEditStudent(studentId)}
        //                 >
        //                     {showDeleteStudents && (
        //                         <td
        //                             className="text-red-400"
        //                             onClick={(e) => {
        //                                 e.stopPropagation();
        //                                 deleteStudent(studentId);
        //                             }}
        //                         >
        //                             Delete
        //                         </td>
        //                     )}
        //                     {schema.map((field) => (
        //                         <td key={field}>{studentData[field]}</td>
        //                     ))}
        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>
        // </div>
    );
}
