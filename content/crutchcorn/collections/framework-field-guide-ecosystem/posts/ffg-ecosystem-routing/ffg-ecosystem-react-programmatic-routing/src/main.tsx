import ReactDOM from "react-dom/client";
import {
	Link,
	Outlet,
	RouterProvider,
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";

function RootComponent() {
	return (
		<>
			<Outlet />
		</>
	);
}

const rootRoute = createRootRoute({
	component: RootComponent,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: IndexComponent,
});

function IndexComponent() {
	return (
		<>
			<h1>Home</h1>
			<Link to={"/other"}>Other</Link>
		</>
	);
}

const otherRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/other",
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

const routeTree = rootRoute.addChildren([indexRoute, otherRoute]);

// Set up a Router instance
const router = createRouter({
	routeTree,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);

	root.render(<RouterProvider router={router} />);
}
