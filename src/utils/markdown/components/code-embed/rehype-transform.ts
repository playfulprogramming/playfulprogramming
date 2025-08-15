import { RehypeFunctionComponent } from "../types";
import path from "path";
import fs from "fs/promises";
import { getStackblitzUrl } from "./getStackblitzUrl";
import { logError } from "utils/markdown/logger";
import { Plugin } from "unified";
import {
	ComponentMarkupNode,
	createComponent,
	PlayfulRoot,
} from "../components";
import { visit } from "unist-util-visit";
import { FileEntry } from "components/code-embed/types";

/**
 * Transforms pfp-code iframes into a "code-embed" component
 * Expects: <iframe data-frame-title="Title" src="pfp-code:./project-slug?file=src%2Findex.ts"></iframe>
 */
export const rehypeCodeEmbed: Plugin<[], PlayfulRoot> = () => {
	return (tree, vfile) => {
		visit(
			tree,
			{ type: "element", tagName: "iframe" },
			(node, index, parent) => {
				if (index === undefined) return;

				const src = String(node.properties.src);

				if (!URL.canParse(src)) {
					logError(vfile, node, `Cannot parse URL '${src}'`);
					return;
				}

				const srcUrl = new URL(src);
				if (srcUrl.protocol !== "pfp-code:") return;

				const title = node.properties.dataFrameTitle?.toString() ?? "";
				const projectDir = path.resolve(
					process.cwd(),
					vfile.path,
					"..",
					srcUrl.pathname,
				);
				const post = path.basename(path.resolve(projectDir, ".."));
				const project = path.basename(projectDir);
				const file = srcUrl.searchParams.get("file") ?? "";

				const replacement: ComponentMarkupNode = {
					type: "playful-component-markup",
					position: node.position,
					component: "code-embed",
					attributes: {
						projectDir,
						post,
						project,
						title,
						file,
					},
					children: [],
				};

				parent?.children.splice(index, 1, replacement);
			},
		);
	};
};

export const transformCodeEmbed: RehypeFunctionComponent = async (props) => {
	const selectedFiles = props.attributes.file.split(",");
	const post = props.attributes.post;
	const project = props.attributes.project;
	const projectDir = props.attributes.projectDir;
	const editUrl = getStackblitzUrl(path.relative(process.cwd(), projectDir), {
		file: selectedFiles.join(","),
	});

	const files: Array<FileEntry> = [];
	for (const file of await fs.readdir(projectDir, {
		withFileTypes: true,
		recursive: true,
	})) {
		if (file.isFile()) {
			const parent = path.relative(projectDir, file.parentPath);
			const name = path.join(parent, file.name);
			const code = await fs.readFile(path.join(projectDir, name), "utf-8");

			files.push({
				name: path.join(parent, file.name),
				filetype: path.extname(file.name).substring(1),
				code,
			});
		}
	}

	for (const file of selectedFiles) {
		if (files.every((entry) => entry.name != file)) {
			logError(
				props.vfile,
				props.node,
				`File '${selectedFiles}' does not exist in ${project}!`,
			);
		}
	}

	return [
		createComponent("CodeEmbed", {
			projectId: project,
			projectZipUrl: `/generated/projects/${post}_${project}.zip`,
			title: props.attributes.title,
			file: selectedFiles.at(0),
			files,
			editUrl,
		}),
	];
};
