// App.jsx
import { Layout } from "./Layout";
import { Sidebar } from "./Sidebar";
import { FileList } from "./FileList";

export function App() {
	return (
		<Layout sidebar={<Sidebar />}>
			<FileList />
		</Layout>
	);
}
