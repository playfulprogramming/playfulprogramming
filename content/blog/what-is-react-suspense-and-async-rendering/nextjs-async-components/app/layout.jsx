export const metadata = {
	title: "Next.js Async Components",
	description: "For use in the Next.js Suspense article on Unicorn Utterances",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
