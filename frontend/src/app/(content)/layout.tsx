import Sidebar from "@/components/DirectoryComponents/Sidebar";

type ContentLayoutProps = { children: React.ReactNode };
export default function ContentLayout({ children }: ContentLayoutProps) {
    return (
        <div className="flex w-full justify-center gap-9">
            <Sidebar />
            <div className="w-2/3 mt-20">{children}</div>
        </div>
    );
}
