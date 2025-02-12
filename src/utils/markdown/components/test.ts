/**
 * Types that will live in a shared type file.
 */
import path from "path";
import { RehypeFunctionProps } from "./types";
import { CounterCompProps } from "./test.fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface RehypeSetupProps<TAttributes = Record<string, string>> {
	// Must be serializable, which should be true, as it originates from HTML attributes
	attributes: TAttributes;
	// The root node returned from `component`
	rootNode: HTMLElement;
	// UUIDv4 for the component instance
	uniqueId: string;
}

interface RehypeTakedownProps<TAttributes = Record<string, string>> {
	// Must be serializable, which should be true, as it originates from HTML attributes
	attributes: TAttributes;
	// UUIDv4 for the component instance
	uniqueId: string;
}

interface BuildtimeComponentParts<TProps, TReturn> {
	// This is the rehype transformer, only used when parsing markdown
	// Either during build time or when the markdown is loaded in the CMS rich text editor
	transform: TransformFn<TProps, TReturn>;
}

interface RuntimeComponentParts<T> {
	// This is the markup for the component that will be rendered
	// Must be a string so we can transform the JSX and then dynamically `import` it from the same path (so `import`s work)
	componentFSPath: string;
	// This script is run when the component is mounted, but also when a blog post is displayed that has the component
	// It is lazily-initialized, so if a blog post does not have the component, this script will not be run
	// This lazy-initialization works by parsing the JS itself into a string, then saving it to a `public/scripts` path during build time
	// This allows us to avoid `new Function` or `eval` which are security risks when evaluating network-provided code
	setup: (props: RehypeSetupProps<T>) => void;
	// Only used in the CMS, when a component is removed dynamically
	takedown: (props: RehypeTakedownProps<T>) => void;
}

type TransformFn<TProps, TReturn> = (
	props: RehypeFunctionProps<TProps>,
) => Promise<TReturn>;

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

function createComponent<TProps>() {
	const getRuntimeBuilder = function <TReturn>(
		buildComps: BuildtimeComponentParts<TProps, TReturn>,
	) {
		return {
			withRuntime(parts: RuntimeComponentParts<TReturn>) {
				return Object.assign({}, parts, buildComps) as Prettify<
					RuntimeComponentParts<TReturn> &
						BuildtimeComponentParts<TProps, TReturn>
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

/**
 * Now to define the component itself.
 */
interface WindowCounterData {
	count: number;
}

declare global {
	interface Window {
		compInfo: Record<string, WindowCounterData>;
	}
}

interface CounterProps {
	initialCount?: number;
}

// `counter` is now an object with `{transform, component, setup, takedown}`
// This is a builder pattern, so you can chain calls to `withBuildTime` and `withRuntime` and infer the types from the previous call.
const counter = createComponent<CounterProps>()
	.withBuildTime({
		transform: async (props) => {
			return {
				count: props.attributes?.["initialCount"] ?? 0,
			} satisfies CounterCompProps;
		},
	})
	.withRuntime({
		// Dynamically transform the JSX to HyperScript (Static build) or React.createElement (CMS build) via Recma
		componentFSPath: path.resolve(__dirname, "test.fs.tsx"),
		setup: (props) => {
			window.compInfo[props.uniqueId] = window.compInfo[props.uniqueId] ?? {};
			const compInfoObj = window.compInfo[props.uniqueId];
			compInfoObj.count = props.attributes.count ?? 0;
			props.rootNode.addEventListener("click", () => {
				compInfoObj.count++;
				props.rootNode.textContent = `The count is ${compInfoObj.count}`;
			});
		},
		takedown: (props) => {
			delete window.compInfo[props.uniqueId];
		},
	});

export default {
	counter,
};
