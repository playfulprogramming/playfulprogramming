import type { VFile } from "vfile";
import * as kleur from "kleur/colors";
import * as path from "path";
import env from "#src/constants/env/index.ts";
import type { WarningInfo } from "./types.ts";

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
			// In GitHub Actions, format an error message that can show up in a PR
			// https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message
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
			// Otherwise, print something readable to the console
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

/** Capture source text before processing and report its messages on completion. */
export function createReporter(file: VFile) {
	const contents = file.toString();
	return {
		success<T>(result: T): T {
			reportMessages(file, contents);
			return result;
		},
		failure(error: unknown): never {
			reportMessages(file, contents);
			throw error;
		},
	};
}
