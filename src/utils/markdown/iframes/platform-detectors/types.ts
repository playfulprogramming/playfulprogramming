import { Root, Element } from "hast";
import { VFile } from "vfile";
import { ComponentMarkupNode } from "utils/markdown/components";
import { UrlMetadataResponse } from "utils/hoof";

interface SrcData {
	src: string;
	metadata: UrlMetadataResponse | undefined;
}

export interface PlatformDetector {
	detect(src: SrcData): boolean;
	rehypeTransform: (props: {
		tree: Root;
		file: VFile;
		parent: Root | ComponentMarkupNode;
		node: Element;
		src: string;
		index: number;
		metadata: UrlMetadataResponse | undefined;
	}) => Promise<void>;
}
