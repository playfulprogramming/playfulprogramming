import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/other")({
	component: OtherComponent,
});

function OtherComponent() {
	return (
		<>
			<h1>Other</h1>
			<Link to={"/"}>Home</Link>
		</>
	);
}
