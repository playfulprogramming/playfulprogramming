import { createRoot } from "react-dom/client";

const Table = ({ data, header, children }) => {
	const headerContents = header({ length: data.length });

	const body = data.map((value, rowI) => children({ value, rowI }));

	return (
		<table>
			<thead>{headerContents}</thead>
			<tbody>{body}</tbody>
		</table>
	);
};

const data = [
	{
		name: "Corbin",
		age: 24,
	},
	{
		name: "Joely",
		age: 28,
	},
	{
		name: "Frank",
		age: 33,
	},
];

function App() {
	return (
		<Table
			data={data}
			header={({ length }) => (
				<tr>
					<th>{length} items</th>
				</tr>
			)}
		>
			{({ rowI, value }) => (
				<tr>
					<td
						style={
							rowI % 2
								? { background: "lightgrey" }
								: { background: "lightblue" }
						}
					>
						{value.name}
					</td>
				</tr>
			)}
		</Table>
	);
}

createRoot(document.getElementById("root")).render(<App />);
