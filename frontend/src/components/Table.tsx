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
    RowData,
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
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import trashcan from "../../public/svgs/trashcan.svg";
import Image from "next/image";

declare module "@tanstack/react-table" {
    //allows us to define custom properties for our columns
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: "text" | "select";
    }
}

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

    const deleteStudent = useCallback(
        async (studentId: string) => {
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
        },
        [data]
    );

    const columnHelper = createColumnHelper<StudentGeneralInfo>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns = useMemo<ColumnDef<StudentGeneralInfo, any>[]>(
        () => [
            columnHelper.accessor((row) => row["First Name"], {
                id: "First Name",
                header: () => "First Name",
                cell: (info) => info.getValue(),
                // filterFn: "includesString",
                sortingFn: "alphanumeric",
            }),
            columnHelper.accessor((row) => row["Last Name"], {
                id: "Last Name",
                header: () => "Last Name",
                cell: (info) => info.getValue(),
                // filterFn: "includesString",
                sortingFn: "alphanumeric",
            }),
            columnHelper.accessor((row) => row["Grade"], {
                id: "Grade",
                header: () => "Grade",
                cell: (info) => info.getValue<Grade>(),
                // filterFn: "equalsString",
                sortingFn: "alphanumeric",
                meta: {
                    filterVariant: "select",
                },
            }),
            columnHelper.accessor((row) => row["Teacher"], {
                id: "Teacher",
                header: () => "Teacher",
                cell: (info) => info.getValue(),
                // filterFn: "includesString",
                sortingFn: "alphanumeric",
            }),
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        filterFns: {},
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
        <div className="flex flex-col p-2 w-full overflow-x-auto">
            <div className="w-full overflow-x-auto">
                <table className="table min-w-[600px] lg:min-w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {showDeleteStudents && (
                                    <th className="w-5 md:w-12 lg:w-1/12 px-2 md:px-4"></th>
                                )}
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
                                                    ? "w-1/5"
                                                    : "w-1/4"
                                            }
                                            px-2 md:px-4
                                        `}
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="cursor-pointer select-none">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </div>
                                        {showSearch && (
                                            <Filter column={header.column} />
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteStudent(row.original["Id"]);
                                        }}
                                        className="w-5 md:w-12 lg:w-1/12 px-2 md:px-4"
                                    >
                                        <div className="flex justify-center">
                                            <Image
                                                src={trashcan}
                                                alt="delete"
                                                width={16}
                                                height={16}
                                                className="min-w-[16px]"
                                            />
                                        </div>
                                    </td>
                                )}
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className={`
                                            ${
                                                showDeleteStudents
                                                    ? "w-1/5"
                                                    : "w-1/4"
                                            }
                                            px-2 md:px-4
                                        `}
                                    >
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
            </div>
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
    console.log("Rerendering");
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
    }, [value]);

    return (
        <input
            {...props}
            key={String(initialValue)}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}
