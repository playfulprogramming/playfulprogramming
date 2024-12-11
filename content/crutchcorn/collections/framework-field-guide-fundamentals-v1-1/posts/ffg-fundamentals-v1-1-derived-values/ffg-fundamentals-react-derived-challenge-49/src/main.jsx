import { createRoot } from "react-dom/client";
import { useState, useEffect, useMemo } from "react";

function DisplaySize({ bytes }) {
	const humanReadableSize = useMemo(() => formatBytes(bytes), [bytes]);
	return <p>{humanReadableSize}</p>;
}

const kilobyte = 1024;
const megabyte = kilobyte * 1024;
const gigabyte = megabyte * 1024;

function formatBytes(bytes) {
	if (bytes < kilobyte) {
		return `${bytes} B`;
	} else if (bytes < megabyte) {
		return `${Math.floor(bytes / kilobyte)} KB`;
	} else if (bytes < gigabyte) {
		return `${Math.floor(bytes / megabyte)} MB`;
	} else {
		return `${Math.floor(bytes / gigabyte)} GB`;
	}
}

function App() {
	return (
		<table>
			<thead>
				<tr>
					<th>Bytes</th>
					<th>Human Readable</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<p>138 bytes</p>
					</td>
					<td>
						<DisplaySize bytes={138} />
					</td>
				</tr>
				<tr>
					<td>
						<p>13,876 bytes</p>
					</td>
					<td>
						<DisplaySize bytes={13876} />
					</td>
				</tr>
				<tr>
					<td>
						<p>13,876,435 bytes</p>
					</td>
					<td>
						<DisplaySize bytes={13876435} />
					</td>
				</tr>
				<tr>
					<td>
						<p>13,876,435,892 bytes</p>
					</td>
					<td>
						<DisplaySize bytes={13876435892} />
					</td>
				</tr>
			</tbody>
		</table>
	);
}

createRoot(document.getElementById("root")).render(<App />);
