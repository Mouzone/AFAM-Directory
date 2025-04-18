import { db } from "@/utility/firebase";
import { Grade, StudentGeneralInfo } from "@/utility/types";
import {
    Column,
    ColumnDef,
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
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import trashcan from "../../public/svgs/trashcan.svg";
import Image from "next/image";

type TableProps = {
    data: StudentGeneralInfo[];
    showEditStudent: (student: StudentGeneralInfo) => void;
    showDeleteStudents: boolean;
    setData: Dispatch<SetStateAction<StudentGeneralInfo[]>>;
    showSearch: boolean;
};
export default function Table({
    data,
    showSearch,
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

    useEffect(() => {
        setColumnFilters([]);
    }, [showSearch]);

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns = useMemo<ColumnDef<StudentGeneralInfo, any>[]>(
        () => [
            columnHelper.accessor((row) => row["First Name"], {
                id: "First Name",
                header: () => "First Name",
                cell: (info) => info.getValue(),
                filterFn: "includesString",
                sortingFn: "alphanumeric",
                meta: {},
            }),
            columnHelper.accessor((row) => row["Last Name"], {
                id: "Last Name",
                header: () => "Last Name",
                cell: (info) => info.getValue(),
                filterFn: "includesString",
                sortingFn: "alphanumeric",
                meta: {},
            }),
            columnHelper.accessor((row) => row["Grade"], {
                id: "Grade",
                header: () => "Grade",
                cell: (info) => info.getValue<Grade>(),
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
                meta: {},
            }),
        ],
        [columnHelper]
    );

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
        autoResetPageIndex: true,
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
                                    className={`
                                        ${
                                            header.column.getIsSorted()
                                                ? "bg-gray-300"
                                                : ""
                                        }
                                        ${
                                            showDeleteStudents
                                                ? "w-1/4"
                                                : "w-1/5"
                                        }`}
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
                                        {{
                                            asc: " 🔼",
                                            desc: " 🔽",
                                        }[
                                            header.column.getIsSorted() as string
                                        ] ?? null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {showSearch &&
                        table.getHeaderGroups().map((headerGroup) => (
                            <tr>
                                {headerGroup.headers.map((header) => (
                                    <td>
                                        <Filter column={header.column} />
                                    </td>
                                ))}
                            </tr>
                        ))}
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
                                    <Image src={trashcan} alt="delete" />
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
                    {pagination["pageIndex"] + 1}
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

function Filter({ column }: { column: Column<StudentGeneralInfo, unknown> }) {
    const columnFilterValue = column.getFilterValue();
    const { filterVariant } =
        (column.columnDef.meta as {
            filterVariant?: "text" | "select";
        }) ?? {};

    return filterVariant === "select" ? (
        <select
            onClick={(e) => e.stopPropagation()}
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
            onClick={(e) => e.stopPropagation()}
            className="w-36 border shadow rounded p-2"
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
    }, [debounce, onChange, value]);

    return (
        <input
            {...props}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}
