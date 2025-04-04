"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../components/Providers/AuthProvider";
import { usePathname } from "next/navigation";
import { getDirectory } from "../../../utility/getStudents";
import optionsIcon from "../../../../public/svgs/options.svg";
import Image from "next/image";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

export default function Page() {
    const { user, directories } = useContext(AuthContext);
    const pathname = usePathname();
    const [directoryId, setDirectoryId] = useState("");

    const [isMultiselect, setIsMultiSelect] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);

    // todo: add pagination
    // todo: add redirect if no directory id
    // todo: if data is null, it is either the directory DNE or just no students, cover both casses
    useEffect(() => {
        if (pathname) {
            const segments = pathname.split("/");
            setDirectoryId(segments[segments.length - 1]);
        }
    }, [pathname]);

    const {
        isLoading,
        data: directory,
        error,
    } = useQuery({
        queryKey: [directoryId, "students"],
        queryFn: () => getDirectory(directoryId),
        enabled: directoryId != "",
    });

    const columnHelper = createColumnHelper();

    const columns = directory["metadata"]["schema"].map((field) =>
        columnHelper.accessor(field, {
            id: field,
            cell: (info) => <i>{info.getValue()}</i>,
            header: () => <span>{field}</span>,
            footer: (info) => info.column.id,
        })
    );

    const table = useReactTable({
        data: directory["data"],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    if (!user) {
        return <></>;
    }
    if (!directory) {
        return <></>;
    }
    return (
        <>
            <div className="flex justify-end">
                <div className="dropdown dropdown-end dropdown-hover">
                    <Image priority src={optionsIcon} alt="menu" />
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                    >
                        <li>Add Person</li>
                        <li>Filter</li>
                        <li>Multiselect</li>
                    </ul>
                </div>
            </div>

            <div className="overflow-x-auto p-2">
                <table className="table">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
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
                                                  header.column.columnDef
                                                      .footer,
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
            <p> {error?.message} </p>
        </>
    );
}
