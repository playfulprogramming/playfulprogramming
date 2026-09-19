import type { VFile } from "vfile";
import * as kleur from "kleur/colors";
import * as path from "path";
import env from "#src/constants/env/index.ts";
import type { WarningInfo } from "./types.ts";

// Content reading and rendering can share a file and report at separate boundaries.
const reportedMessages = new WeakSet<VFile["messages"][number]>();

function messagePath(file: VFile, message: VFile["messages"][number]) {
	const filePath = message.file || file.path;
	return filePath
		? path.relative(file.cwd, path.resolve(file.cwd, filePath))
		: "";
}

/** Keep the lint API's response shape, with VFile as the only diagnostic store. */
export function getMarkdownWarnings(file: VFile): WarningInfo[] {
	return file.messages
		.filter((message) => message.fatal !== undefined)
		.map((message) => ({
			message: message.reason,
			path: messagePath(file, message),
			offset:
				message.place && "start" in message.place
					? message.place.start.offset
					: message.place?.offset,
			col: message.column,
			line: message.line,
		}));
}

function escapeAnnotation(value: string) {
	return value
		.replaceAll("%", "%25")
		.replaceAll("\r", "%0D")
		.replaceAll("\n", "%0A");
}

function reportMessages(file: VFile, contents: string) {
	for (const message of file.messages) {
		if (reportedMessages.has(message)) continue;
		reportedMessages.add(message);

		const level =
			message.fatal === true
				? "error"
				: message.fatal === false
					? "warning"
					: "notice";
		const start =
			message.place && "start" in message.place
				? message.place.start
				: message.place;
		const end =
			message.place && "end" in message.place ? message.place.end : undefined;
		const filePath = messagePath(file, message);

		if (env.CI) {
			const meta = {
				file: filePath || undefined,
				col: message.column,
				endColumn: end?.column,
				line: message.line,
				endLine: end?.line,
			};
			const properties = Object.entries(meta)
				.filter(([, value]) => value !== undefined)
				.map(
					([key, value]) =>
						`${key}=${escapeAnnotation(String(value)).replaceAll(":", "%3A").replaceAll(",", "%2C")}`,
				)
				.join(",");
			console.error(
				`::${level}${properties ? ` ${properties}` : ""}::${escapeAnnotation(message.reason)}`,
			);
		} else {
			const color =
				level === "error"
					? kleur.red
					: level === "warning"
						? kleur.yellow
						: kleur.blue;
			console.error(color(`[${level.toUpperCase()}] ${message.reason}`));
			if (start?.offset !== undefined && end?.offset !== undefined) {
				console.log(`\t${contents.slice(start.offset, end.offset)}`);
				console.log("\t^");
			}
			console.log(
				kleur.gray(
					`\tin ${filePath || "<markdown>"}${message.line === undefined ? "" : `:${message.line}`}`,
				),
			);
		}
	}
}

/** Report every plugin's messages, including when processing stops early. */
export async function withMarkdownDiagnostics<T>(
	file: VFile,
	callback: () => T | Promise<T>,
): Promise<T> {
	const contents = file.toString();
	try {
		return await callback();
	} finally {
		reportMessages(file, contents);
	}
}
