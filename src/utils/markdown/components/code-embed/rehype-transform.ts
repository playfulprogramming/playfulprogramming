import { RehypeFunctionComponent, RehypeFunctionProps } from "../types";
import { fetchProjectZip } from "./fetchProjectZip";
import { basename, dirname, extname, join, relative, resolve } from "path";
import { type CodeSnippetProps, CodeEmbed, CodeEmbedEpub } from "./code-embed";
import fs from "fs/promises";
import { getStackblitzUrl } from "./getStackblitzUrl";
import { logError } from "utils/markdown/logger";

async function getFileSnippets({
	vfile,
	node,
	attributes,
}: RehypeFunctionProps): Promise<CodeSnippetProps[]> {
	const project = attributes.project!;
	const projectDir = resolve(dirname(vfile.path), project);

	const filePaths: string[] = [];
	for (const file of String(attributes.file).split(",")) {
		const filePath = resolve(projectDir, file);
		const fileStat = await fs.stat(filePath).catch(() => undefined);
		if (!fileStat || !fileStat.isFile()) {
			logError(vfile, node, `File ${file} does not exist in ${project}!`);
			return [];
		}

		filePaths.push(filePath);
	}

	const fileSnippets = [];
	const lines = attributes.lines?.split(",") ?? [];
	const languages = attributes.language?.split(",") ?? [];

	for (let i = 0; i < Math.max(filePaths.length, lines.length); i++) {
		const filePath = filePaths[i] ?? filePaths.at(-1);
		const fileLines = (await fs.readFile(filePath, "utf-8")).split("\n");
		const snippetLines = lines[i] || `1-${fileLines.length}`;
		if (snippetLines === "off") continue;

		const [start, end = start] = snippetLines.split("-");
		const snippet = [];
		for (let i = Number(start) - 1; i < Number(end); i++) {
			if (!(i in fileLines)) {
				logError(
					vfile,
					node,
					`Range ${snippetLines} is beyond ${filePath}: 1-${fileLines.length}`,
				);
				break;
			}
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
			language: languages[i] ?? extname(filePath).substring(1),
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
		snippets: await getFileSnippets({ vfile, node, attributes, children }),
		addressPrefix: new URL(
			file.split("/").at(-1) ?? "",
			"http://localhost",
		).toString(),
		address: attributes["preview-url"] ?? "",
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
		snippets: await getFileSnippets({ vfile, node, attributes, children }),
		projectZip,
		addressPrefix: "http://localhost/",
		address: attributes["preview-url"] ?? "",
		children,
	});
}

export const transformCodeEmbed: RehypeFunctionComponent = async (props) => {
	const driver = props.attributes.driver ?? "webcontainer";

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

export const transformCodeEmbedEpub: RehypeFunctionComponent = async ({
	vfile,
	node,
	attributes,
	children,
}) => {
	const project = attributes.project;
	const file = attributes.file;

	if (!project || !file) {
		logError(vfile, node, "Attributes 'project' and 'file' must be defined!");
		return undefined;
	}

	const projectDir = resolve(dirname(vfile.path), project);

	return CodeEmbedEpub({
		title: attributes.title ?? basename(file),
		editUrl: getStackblitzUrl(relative(vfile.cwd, projectDir), { file }),
		snippets: await getFileSnippets({ vfile, node, attributes, children }),
		children,
	});
};
