import { StudentGeneralInfo } from "@/utility/types";
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowData,
    useReactTable,
} from "@tanstack/react-table";
import { useContext, useEffect, useMemo, useState } from "react";
import trashcan from "../../public/svgs/trashcan.svg";
import Image from "next/image";
import { deleteStudent } from "@/utility/cloudFunctions";
import { ToastContext } from "./Providers/ToastProvider";

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
    showSearch: boolean;
};
export default function Table({
    data,
    showSearch,
    showEditStudent,
    showDeleteStudents,
}: TableProps) {
    const { setMessage } = useContext(ToastContext)!;
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const columns = useMemo<ColumnDef<StudentGeneralInfo, any>[]>(
        () => [
            {
                accessorKey: "Headshot URL",
                header: "",
                cell: (info) =>
                    info.getValue() !== "" && (
                        <div className="flex justify-center">
                            <img
                                src={info.getValue()}
                                alt="profile"
                                width={100}
                            />
                        </div>
                    ),
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                accessorKey: "First Name",
                header: () => "First Name",
                meta: {
                    filterVariant: "text",
                },
            },
            {
                accessorKey: "Last Name",
                header: () => "Last Name",
                meta: {
                    filterVariant: "text",
                },
            },
            {
                accessorKey: "Grade",
                header: () => "Grade",
                meta: {
                    filterVariant: "select",
                },
            },
            {
                accessorKey: "Teacher",
                header: () => "Teacher",
                meta: {
                    filterVariant: "text",
                },
            },
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
        onColumnFiltersChange: setColumnFilters,
        initialState: {
            pagination: {
                pageSize: 14,
            },
        },
        state: {
            columnFilters,
        },
        enableSortingRemoval: false,
    });

    return (
        <div className="flex flex-col p-2 w-full overflow-x-auto">
            <div className="w-full overflow-x-auto">
                <table className="table min-w-[600px] lg:min-w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr
                                key={headerGroup.id}
                                className="bg-black text-white"
                            >
                                {showDeleteStudents && (
                                    <th className="w-5 md:w-12 lg:w-1/12 px-2 md:px-4"></th>
                                )}
                                {headerGroup.headers.map((header) => (
                                    <th
                                        className={`
                                            ${
                                                showDeleteStudents
                                                    ? "w-1/6"
                                                    : "w-1/5"
                                            }
                                            px-2 md:px-4
                                        `}
                                        key={header.id}
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
                                        <div>
                                            {showSearch &&
                                                header.column.getCanFilter() && (
                                                    <Filter
                                                        column={header.column}
                                                    />
                                                )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            <tr
                                className={`hover:bg-base-300 h-20 dark:hover:bg-accent ${
                                    index % 2
                                        ? "bg-gray-200 dark:bg-secondary"
                                        : ""
                                }`}
                                key={row.id}
                                onClick={() => showEditStudent(row.original)}
                            >
                                {showDeleteStudents && (
                                    <td
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                await deleteStudent({
                                                    studentId:
                                                        row.original["Id"],
                                                });
                                                setMessage(
                                                    "Student successfully deleted"
                                                );
                                            } catch {
                                                setMessage(
                                                    "Student could not be deleted"
                                                );
                                            }
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
                                                    ? "w-1/6"
                                                    : "w-1/5"
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
                    {table.getState().pagination.pageIndex + 1}
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

// @ts-ignore
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
            className="w-36 border shadow rounded p-2"
            onChange={(value) => column.setFilterValue(value)}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? "") as string}
        />
    );
}

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 300,
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
            className="w-20 sm:w-fit"
        />
    );
}
