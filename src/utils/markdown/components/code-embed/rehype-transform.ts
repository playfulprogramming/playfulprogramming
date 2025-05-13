import { RehypeFunctionComponent, RehypeFunctionProps } from "../types";
import { fetchProjectZip } from "./fetchProjectZip";
import { basename, dirname, extname, join, relative, resolve } from "path";
import { CodeEmbed } from "./code-embed";
import fs from "fs/promises";
import { getStackblitzUrl } from "./getStackblitzUrl";
import { logError } from "utils/markdown/logger";
import { VFile } from "vfile";

async function getFileSnippets({
	vfile,
	node,
	attributes,
}: RehypeFunctionProps): Promise<{ line: number; text: string }[]> {
	const project = attributes.project!;
	const file = attributes.file!;

	const projectDir = resolve(dirname(vfile.path), project);

	const filePath = resolve(projectDir, file);
	const fileStat = await fs.stat(filePath).catch(() => undefined);
	if (!fileStat || !fileStat.isFile()) {
		logError(vfile, node, `File ${file} does not exist in ${project}!`);
		return [];
	}

	const fileLines = (await fs.readFile(filePath, "utf-8")).split("\n");
	const fileSnippets = [];
	const lines = attributes.lines ?? `1-${fileLines.length}`;

	for (const snippetLines of lines.split(",")) {
		const [start, end = start] = snippetLines.split("-");
		const snippet = [];
		for (let i = Number(start) - 1; i < Number(end); i++) {
			snippet.push(fileLines[i]);
		}

		const indentSize = Math.min(
			...snippet.map((line) => /^[ \t]*/.exec(line)![0].length),
		);
		for (const i in snippet) {
			snippet[i] = snippet[i].substring(indentSize);
		}

		fileSnippets.push({
			line: Number(start),
			text: snippet.join("\n"),
		});
	}

	return fileSnippets;
}

async function createStaticEmbed({
	vfile,
	node,
	attributes,
	children,
}: RehypeFunctionProps) {
	const project = attributes.project;
	const file = attributes.file;

	if (!project || !file) {
		logError(vfile, node, "Attributes 'project' and 'file' must be defined!");
		return undefined;
	}

	const projectDir = resolve(dirname(vfile.path), project);

	return CodeEmbed({
		driver: "static",
		height: attributes.height,
		title: attributes.title ?? basename(file),
		editUrl: getStackblitzUrl(relative(vfile.cwd, projectDir), { file }),
		language: extname(file).substring(1),
		snippets: await getFileSnippets({ vfile, node, attributes, children }),
		address: new URL(file, "http://localhost").toString(),
		staticUrl: "/" + join(relative(vfile.cwd, projectDir), file),
		children,
	});
}

async function createWebcontainerEmbed({
	vfile,
	node,
	attributes,
	children,
}: RehypeFunctionProps) {
	const project = attributes.project;
	const file = attributes.file;

	if (!project || !file) {
		logError(vfile, node, "Attributes 'project' and 'file' must be defined!");
		return undefined;
	}

	const projectDir = resolve(dirname(vfile.path), project);
	const projectZip = await fetchProjectZip(projectDir);

	return CodeEmbed({
		driver: "webcontainer",
		height: attributes.height,
		title: attributes.title ?? basename(file),
		editUrl: getStackblitzUrl(relative(vfile.cwd, projectDir), { file }),
		language: extname(file).substring(1),
		snippets: await getFileSnippets({ vfile, node, attributes, children }),
		projectZip,
		address: new URL(
			attributes["preview-url"] ?? "",
			"http://localhost",
		).toString(),
		children,
	});
}

export const transformCodeEmbed: RehypeFunctionComponent = async (props) => {
	const driver = props.attributes.driver ?? "webcontainer";

	// TODO: calculate heading level?

	if (driver == "static") {
		return await createStaticEmbed(props);
	} else if (driver == "webcontainer") {
		return await createWebcontainerEmbed(props);
	} else if (driver == "none") {
		return CodeEmbed({
			driver: "none",
			snippets: [],
			children: props.children,
		});
	} else {
		logError(props.vfile, props.node, `Unrecognized embed driver '${driver}'`);
	}
};
