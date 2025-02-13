import { dirname, resolve, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promises as fs } from "node:fs";

import esbuild from "esbuild";

import {
	BuildtimeComponentParts,
	CreateComponentReturn,
	Prettify,
	RuntimeComponentParts,
} from "./types";

const __dirname = dirname(fileURLToPath(import.meta.url));

const rootDir = resolve(__dirname, "../../../../");

const tmpDir = resolve(rootDir, "./md-tmp");

/**
 * This is getting the `export default`'d function from a `.tsx` file
 * The reason we're using a path rather than an `import` is so that we can dynamically
 * (at runtime) change the `jsxImportSource` from `hastscript` (Astro build) to
 * `preact` (CMS build).
 *
 * However, by doing this, we now run into a new problem: Relative imports don't
 * resolve anymore.
 *
 * To solve this, instead of using something like `recma` to transform a single
 * file's JSX, we use `esbuild` (already used by Astro) to bundle the relatively
 * imported files into a single JS file.
 *
 * HOWever, we then have a difference challenge: When we tell ESBuild to bundle
 * libraries into the single JS file, they're huge and become computationally
 * hard to compile then parse during the dynamic `import`. To solve this, we simply
 * tell ESBuild to mark all external deps as actual `import` statements
 *
 * HOWEVER, by doing this, we now have an implicit relationship to Astro's `node_modules`.
 * While we could build an ESBuild plugin that rewrites `import`s and `require`s
 * to look in a different `node_modules` path, but just keeping a `md-tmp` folder
 * in our project root and clearing it out every time seems to just be a lot less
 * brittle.
 *
 * Now you might think that we can `unlink` (`rm`) the file once we've gotten the
 * function reference, but you'd be wrong! This is because of how JS import semantics
 * work. See, when you `import` anything from a file, it keeps a reference to that
 * file at runtime. So when you get the function reference, then delete the function,
 * then call the function, we end up with an error of "file does not exist".
 */
export async function getHastScriptCompFunction(
	inputFileName: string,
): Promise<(...props: unknown[]) => unknown> {
	const fileName = basename(inputFileName);
	const outFsFileName = resolve(tmpDir, fileName + ".tmp.js");

	const { errors, warnings } = await esbuild.build({
		jsx: "automatic",
		tsconfigRaw: {
			compilerOptions: {
				jsx: "react-jsx",
				jsxImportSource: "hastscript",
			},
		},
		jsxImportSource: "hastscript",
		outfile: outFsFileName,
		entryPoints: [inputFileName],
		bundle: true,
		minify: false,
		format: "esm",
		packages: "external",
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

	return output;
}

export function getComponentScriptPath(componentName: string) {
	const serverRelativePath = `/scripts/${componentName}.js`;
	const fsAbsolutePath = resolve(rootDir, "./public" + serverRelativePath);

	return {
		serverRelativePath,
		fsAbsolutePath,
	};
}

export async function saveComponentScript(
	componentName: string,
	component: CreateComponentReturn<Record<string, string>, unknown>,
) {
	// "Did not write anything"
	if (!component.setup) return false;
	// Bundle with ESBuild
	const { fsAbsolutePath } = getComponentScriptPath(componentName);

	const setupFnStr = `var __fn = ${component.setup?.toString()}; __fn();`;

	const tmpFilePath = resolve(tmpDir, componentName + ".tmp.js");

	await fs.writeFile(tmpFilePath, setupFnStr, "utf8");

	const { errors, warnings } = await esbuild.build({
		outfile: fsAbsolutePath,
		entryPoints: [tmpFilePath],
		bundle: true,
		minify: true,
		format: "esm",
		// `node_modules` doesn't exist on the browser
		packages: "bundle",
	});

	if (warnings.length) {
		console.warn(warnings);
	}

	if (errors.length) {
		console.error(errors);
		process.exit(1);
	}

	await fs.unlink(tmpFilePath);

	return true;
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
