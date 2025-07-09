import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
	title: "Newcomer Form",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased pt-5 flex justify-center min-h-screen">
				{children}
			</body>
		</html>
	);
}
