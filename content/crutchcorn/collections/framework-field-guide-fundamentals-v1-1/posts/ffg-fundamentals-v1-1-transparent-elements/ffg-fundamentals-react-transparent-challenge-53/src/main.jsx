import { createRoot } from "react-dom/client";

const FileActionButtons = ({ onDelete, onCopy, onFavorite }) => {
	return (
		<>
			<button onClick={onDelete}>Delete</button>
			<button onClick={onCopy}>Copy</button>
			<button onClick={onFavorite}>Favorite</button>
		</>
	);
};

const ButtonBar = ({
	onSettings,
	onDelete,
	onCopy,
	onFavorite,
	fileSelected,
}) => {
	return (
		<div
			style={{
				display: "flex",
				gap: "1rem",
			}}
		>
			{fileSelected && (
				<FileActionButtons
					onDelete={onDelete}
					onCopy={onCopy}
					onFavorite={onFavorite}
				/>
			)}
			<button onClick={onSettings}>Settings</button>
		</div>
	);
};

const App = () => {
	function alertMe(str) {
		alert("You have pressed on " + str);
	}

	return (
		<ButtonBar
			fileSelected={true}
			onSettings={() => alertMe("settings")}
			onDelete={() => alertMe("delete")}
			onCopy={() => alertMe("copy")}
			onFavorite={() => alertMe("favorite")}
		/>
	);
};

createRoot(document.getElementById("root")).render(<App />);
