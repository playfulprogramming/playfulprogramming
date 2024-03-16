import { createRoot } from "react-dom/client";
import {
	Component,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

const Layout = ({ sidebar, sidebarWidth, children }) => {
	return (
		<div style={{ display: "flex", flexWrap: "nowrap", minHeight: "100vh" }}>
			<div
				style={{
					width: `${sidebarWidth}px`,
					height: "100vh",
					overflowY: "scroll",
					borderRight: "2px solid #bfbfbf",
				}}
			>
				{sidebar}
			</div>
			<div style={{ width: "1px", flexGrow: 1 }}>{children}</div>
		</div>
	);
};

const Sidebar = forwardRef(({ toggle }, ref) => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const setAndToggle = (v) => {
		setIsCollapsed(v);
		toggle(v);
	};

	useImperativeHandle(
		ref,
		() => ({
			collapse: () => {
				setAndToggle(true);
			},
			expand: () => {
				setAndToggle(false);
			},
			isCollapsed: isCollapsed,
		}),
		[isCollapsed, setAndToggle],
	);

	const toggleCollapsed = () => {
		setAndToggle(!isCollapsed);
	};

	if (collapsed) {
		return <button onClick={toggleCollapsed}>Toggle</button>;
	}

	return (
		<div>
			<button onClick={toggleCollapsed}>Toggle</button>
			<ul style={{ padding: "1rem" }}>
				<li>List item 1</li>
				<li>List item 2</li>
				<li>List item 3</li>
				<li>List item 4</li>
				<li>List item 5</li>
				<li>List item 6</li>
			</ul>
		</div>
	);
});

const collapsedWidth = 100;
const expandedWidth = 150;
const widthToCollapseAt = 600;

const App = () => {
	const [width, setWidth] = useState(expandedWidth);

	const sidebarRef = useRef();

	useEffect(() => {
		const onResize = () => {
			if (window.innerWidth < widthToCollapseAt) {
				sidebarRef.current.collapse();
			} else if (sidebarRef.current.isCollapsed) {
				sidebarRef.current.expand();
			}
		};

		window.addEventListener("resize", onResize);

		return () => window.removeEventListener("resize", onResize);
	}, [sidebarRef]);

	return (
		<Layout
			sidebarWidth={width}
			sidebar={
				<Sidebar
					ref={sidebarRef}
					toggle={(isCollapsed) => {
						if (isCollapsed) {
							setWidth(collapsedWidth);
							return;
						}
						setWidth(expandedWidth);
					}}
				/>
			}
		>
			<p style={{ padding: "1rem" }}>Hi there!</p>
		</Layout>
	);
};

class ErrorBoundary extends Component {
	state = { error: null };

	static getDerivedStateFromError(error) {
		return { error: error };
	}

	render() {
		const err = this.state.error;
		if (err) {
			const mailTo = "dev@example.com";
			const header = "Bug Found";
			const message = `
      There was a bug found of type: "${err.name}".

      The message was: "${err.message}".

      The stack trace is:

      """
      ${err.stack}
      """
      `.trim();

			const encodedMsg = encodeURIComponent(message);

			const encodedHeader = encodeURIComponent(header);

			const href = `mailto:${mailTo}&subject=${encodedHeader}&body=${encodedMsg}`;

			return (
				<div>
					<h1>{err.name}</h1>
					<pre>
						<code>{err.message}</code>
					</pre>
					<a href={href}>Email us to report the bug</a>
					<br />
					<br />
					<details>
						<summary>Error stack</summary>
						<pre>
							<code>{err.stack}</code>
						</pre>
					</details>
				</div>
			);
		}
		return this.props.children;
	}
}

const Root = () => {
	return (
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	);
};

createRoot(document.getElementById("root")).render(<Root />);
