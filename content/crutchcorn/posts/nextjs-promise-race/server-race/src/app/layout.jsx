export const metadata = {
	title: "Next.js Server Race",
	description: "A demo of racing promises in Next.js",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				{children}
			</body>
		</html>
	);
}
