import components from "./src/utils/markdown/components/test";
import path from "path";
import fs from "fs";
import esbuild from "esbuild";
import { pathToFileURL } from "url";

async function getHastScriptCompFunction(
	inputFileName: string,
): Promise<(...props: unknown[]) => unknown> {
	const outFsFileName = inputFileName + ".tmp.js";

	const { errors } = await esbuild.build({
		jsxImportSource: "hastscript",
		outfile: outFsFileName,
		entryPoints: [inputFileName],
	});

	if (errors.length) {
		console.error(errors);
		process.exit(1);
	}

	const { default: output } = await import(
		pathToFileURL(outFsFileName).toString()
	);

	fs.unlinkSync(outFsFileName);

	return output;
}

components.counter.transform();

await getHastScriptCompFunction(components.counter.componentFSPath);
