/**
 * Types that will live in a shared type file.
 */
import { RehypeFunctionProps } from "utils/markdown/components/types";

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

const counter = {
	// This is the rehype transformer, only used when parsing markdown
	// Either during build time or when the markdown is loaded in the CMS rich text editor
	transform: async (props: RehypeFunctionProps<CounterProps>) => {
		return { initialCount: props.attributes?.["initialCount"] ?? 0 };
	},
	// This is the markup for the component that will be rendered
	component: (props: CounterProps) => {
		return <button>The count is {props.initialCount}</button>;
	},
	// This script is run when the component is mounted, but also when a blog post is displayed that has the component
	// It is lazily-initialized, so if a blog post does not have the component, this script will not be run
	// This lazy-initialization works by parsing the JS itself into a string, then saving it to a `public/scripts` path during build time
	// This allows us to avoid `new Function` or `eval` which are security risks when evaluating network-provided code
	setup: (props: RehypeSetupProps<CounterProps>) => {
		window.compInfo[props.uniqueId] = window.compInfo[props.uniqueId] ?? {};
		const compInfoObj = window.compInfo[props.uniqueId];
		compInfoObj.count = props.attributes.initialCount ?? 0;
		props.rootNode.addEventListener("click", () => {
			compInfoObj.count++;
			props.rootNode.textContent = `The count is ${compInfoObj.count}`;
		});
	},
	// Only used in the CMS, when a component is removed dynamically
	takedown: (props: RehypeTakedownProps<CounterProps>) => {
		delete window.compInfo[props.uniqueId];
	},
};

export default {
	// Selector is `counter` so it can be used in markdown as `<!-- ::counter initialCount="10" -->`
	counter,
};
