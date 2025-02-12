import type * as hast from "hast";
import { VFile } from "vfile";

export type RehypeFunctionProps<TAttributes = Record<string, string>> = {
	vfile: VFile;
	node: hast.Node;
	attributes: TAttributes;
	children: hast.Node[];
};

export interface RehypeSetupProps<TAttributes = Record<string, string>> {
	// Must be serializable, which should be true, as it originates from HTML attributes
	attributes: TAttributes;
	// The root node returned from `component`
	rootNode: HTMLElement;
	// UUIDv4 for the component instance
	uniqueId: string;
}

export interface RehypeTakedownProps<TAttributes = Record<string, string>> {
	// Must be serializable, which should be true, as it originates from HTML attributes
	attributes: TAttributes;
	// UUIDv4 for the component instance
	uniqueId: string;
}

export interface BuildtimeComponentParts<TProps, TReturn> {
	// This is the rehype transformer, only used when parsing markdown
	// Either during build time or when the markdown is loaded in the CMS rich text editor
	transform: TransformFn<TProps, TReturn>;
}

export interface RuntimeComponentParts<T> {
	// This is the markup for the component that will be rendered
	// Must be a string so we can transform the JSX and then dynamically `import` it from the same path (so `import`s work)
	componentFSPath: string;
	// This script is run when the component is mounted, but also when a blog post is displayed that has the component
	// It is lazily-initialized, so if a blog post does not have the component, this script will not be run
	// This lazy-initialization works by parsing the JS itself into a string, then saving it to a `public/scripts` path during build time
	// This allows us to avoid `new Function` or `eval` which are security risks when evaluating network-provided code
	setup?: (props: RehypeSetupProps<T>) => void;
	// Only used in the CMS, when a component is removed dynamically
	takedown?: (props: RehypeTakedownProps<T>) => void;
}

export type TransformFn<TProps, TReturn> = (
	props: RehypeFunctionProps<TProps>,
) => TReturn | Promise<TReturn>;

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
