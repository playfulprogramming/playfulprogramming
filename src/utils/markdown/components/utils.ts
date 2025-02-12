import esbuild from "esbuild";
import { pathToFileURL } from "url";
import fs from "fs";
import {
	BuildtimeComponentParts,
	CreateComponentReturn,
	Prettify,
	RuntimeComponentParts,
} from "./types";

export async function getHastScriptCompFunction(
	inputFileName: string,
): Promise<(...props: unknown[]) => unknown> {
	const outFsFileName = inputFileName + ".tmp.js";

	const { errors, warnings } = await esbuild.build({
		jsxImportSource: "hastscript",
		outfile: outFsFileName,
		entryPoints: [inputFileName],
	});

	if (warnings.length) {
		console.warn(warnings);
	}

	if (errors.length) {
		console.error(errors);
		process.exit(1);
	}

	const { default: output } = await import(
		/* @vite-ignore */
		pathToFileURL(outFsFileName).toString()
	);

	if (!output) {
		throw new Error("No default export found in the component file");
	}

	if (typeof output !== "function") {
		throw new Error(
			"Default export is not a function, it is a " + typeof output,
		);
	}

	await fs.promises.unlink(outFsFileName);

	return output;
}

export function createComponent<TProps>() {
	const getRuntimeBuilder = function <TReturn>(
		buildComps: BuildtimeComponentParts<TProps, TReturn>,
	) {
		return {
			withRuntime(parts: RuntimeComponentParts<TReturn>) {
				return Object.assign({}, parts, buildComps) as Prettify<
					CreateComponentReturn<TProps, TReturn>
				>;
			},
		};
	};

	const initialBuilder = {
		withBuildTime<TReturn>(
			buildComps: BuildtimeComponentParts<TProps, TReturn>,
		) {
			return getRuntimeBuilder(buildComps);
		},
	};

	return initialBuilder;
}
