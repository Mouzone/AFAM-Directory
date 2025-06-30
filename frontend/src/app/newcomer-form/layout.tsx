import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Directory",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased flex items-center justify-center min-h-screen">
                {children}
            </body>
        </html>
    );
}
