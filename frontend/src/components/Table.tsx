import { db } from "@/utility/firebase";
import { StudentGeneralInfo } from "@/utility/types";
import {
    Column,
    ColumnFiltersState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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
            filterFn: "includesString",
            sortingFn: "alphanumeric",
        }),
        columnHelper.accessor((row) => row["Last Name"], {
            id: "Last Name",
            header: () => "Last Name",
            cell: (info) => info.getValue(),
            filterFn: "includesString",
            sortingFn: "alphanumeric",
        }),
        columnHelper.accessor((row) => row["Grade"], {
            id: "Grade",
            header: () => "Grade",
            cell: (info) => info.getValue(),
            filterFn: "equalsString",
            sortingFn: "alphanumeric",
            meta: {
                filterVariant: "select",
            },
        }),
        columnHelper.accessor((row) => row["Teacher"], {
            id: "Teacher",
            header: () => "Teacher",
            cell: (info) => info.getValue(),
            filterFn: "includesString",
            sortingFn: "alphanumeric",
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            pagination,
            columnFilters,
        },
        autoResetPageIndex: false,
        enableMultiSort: false,
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
                                    className={
                                        header.column.getIsSorted()
                                            ? "bg-gray-300"
                                            : ""
                                    }
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <div
                                        className="cursor-pointer select-none"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </div>
                                    {header.column.getCanFilter() ? (
                                        <div>
                                            <Filter column={header.column} />
                                        </div>
                                    ) : null}
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

function Filter({ column }: { column: Column<any, unknown> }) {
    const columnFilterValue = column.getFilterValue();
    const { filterVariant } = column.columnDef.meta ?? {};

    return filterVariant === "select" ? (
        <select
            onChange={(e) => column.setFilterValue(e.target.value)}
            value={columnFilterValue?.toString()}
        >
            {/* See faceted column filters example for dynamic select options */}
            <option value="">Any</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
        </select>
    ) : (
        <DebouncedInput
            className="w-36 border shadow rounded"
            onChange={(value) => column.setFilterValue(value)}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? "") as string}
        />
    );
}

// A typical debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 200,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <input
            {...props}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}
