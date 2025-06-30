export const metadata = {
	title: "React Social Feed",
	description: "A social media feed for React developers",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					padding: 0,
					backgroundColor: "#f7f9fa",
					minHeight: "100vh",
				}}
			>
				{children}
			</body>
		</html>
	);
}
