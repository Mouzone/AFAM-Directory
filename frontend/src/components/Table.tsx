import { db } from "@/utility/firebase";
import { StudentGeneralInfo } from "@/utility/types";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    writeBatch,
} from "firebase/firestore";
import { Dispatch, SetStateAction, useState } from "react";

type TableProps = {
    data: StudentGeneralInfo[];
    showEditStudent: (student: StudentGeneralInfo) => void;
    showDeleteStudents: boolean;
    setData: Dispatch<SetStateAction<StudentGeneralInfo[]>>;
};
export default function Table({
    data,
    showEditStudent,
    showDeleteStudents,
    setData,
}: TableProps) {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 12,
    });
    const [sorting, setSorting] = useState<SortingState>([
        { id: "First Name", desc: false },
    ]);
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
        setData(data.filter((student) => student["Id"] !== studentId));
    };

    const columnHelper = createColumnHelper<StudentGeneralInfo>();

    const columns = [
        columnHelper.accessor((row) => row["First Name"], {
            id: "First Name",
            header: () => "First Name",
            cell: (info) => info.getValue(),
            sortingFn: "alphanumeric",
        }),
        columnHelper.accessor((row) => row["Last Name"], {
            id: "Last Name",
            header: () => "Last Name",
            cell: (info) => info.getValue(),
            sortingFn: "alphanumeric",
        }),
        columnHelper.accessor((row) => row["Grade"], {
            id: "Grade",
            header: () => "Grade",
            cell: (info) => info.getValue(),
            sortingFn: "alphanumeric",
        }),
        columnHelper.accessor((row) => row["Teacher"], {
            id: "Teacher",
            header: () => "Teacher",
            cell: (info) => info.getValue(),
            sortingFn: "alphanumeric",
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        autoResetPageIndex: false,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        enableMultiSort: false,
        state: {
            sorting,
            pagination,
        },
        enableSortingRemoval: false,
    });

    return (
        <div className="flex flex-col p-2">
            <table className="table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {showDeleteStudents && <th></th>}
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
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
                        <tr
                            className="hover:bg-base-300"
                            key={row.id}
                            onClick={() => showEditStudent(row.original)}
                        >
                            {showDeleteStudents && (
                                <td
                                    className="text-red-400"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteStudent(row.original["Id"]);
                                    }}
                                >
                                    Delete
                                </td>
                            )}
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
            </table>
            <div className="join justify-center mt-4">
                <button
                    className="join-item btn"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    «
                </button>
                <div className="join-item btn">
                    {" "}
                    {pagination["pageIndex"] + 1}{" "}
                </div>
                <button
                    className="join-item btn"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    »
                </button>
            </div>
        </div>
    );
}
