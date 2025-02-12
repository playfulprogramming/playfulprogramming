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
