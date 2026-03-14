import "./globals.css";

export const metadata = {
	title: "BiZo Finances",
	description: "Personal finance tracker",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="antialiased">
				{children}
			</body>
		</html>
	);
}
