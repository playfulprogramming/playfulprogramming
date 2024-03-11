// Sidebar.tsx
import { File } from "./File";
import { ContextMenuContext } from "./ContextMenuContext";

const directories = [
	{
		name: "Movies",
		id: 1,
	},
	{
		name: "Documents",
		id: 2,
	},
	{
		name: "Etc",
		id: 3,
	},
];

const getDirectoryById = (id) => {
	return directories.find((dir) => dir.id === id);
};

const onCopy = (id) => {
	const dir = getDirectoryById(id);
	// Some browsers still do not support this
	if (navigator?.clipboard?.writeText) {
		navigator.clipboard.writeText(dir.name);
		alert("Name is copied");
	} else {
		alert("Unable to copy directory name due to browser incompatibility");
	}
};

export const Sidebar = () => {
	return (
		<ContextMenuContext.Provider
			value={{
				actions: [
					{
						label: "Copy directory name",
						fn: onCopy,
					},
				],
			}}
		>
			<div style={{ padding: "1rem" }}>
				<h1 style={{ fontSize: "1.25rem" }}>Directories</h1>
				{directories.map((directory) => {
					return (
						<File key={directory.id} name={directory.name} id={directory.id} />
					);
				})}
			</div>
		</ContextMenuContext.Provider>
	);
};
