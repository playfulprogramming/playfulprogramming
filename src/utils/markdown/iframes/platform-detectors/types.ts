import { Root, Element } from "hast";
import { VFile } from "vfile";
import { ComponentMarkupNode } from "utils/markdown/components";
import { UrlMetadataResponse } from "utils/hoof";

interface IFrameData {
	// May be `100%`, `10px`, `50` or any other `height=""` value
	height: string | number | boolean | (string | number)[];
	width: string | number | boolean | (string | number)[];
	metadata: UrlMetadataResponse | undefined;
	pageTitle: string;
	iframeAttrs: Record<string, string>;
}

export interface PlatformDetector {
	detect(url: string): boolean;
	rehypeTransform: (props: {
		tree: Root;
		file: VFile;
		parent: Root | ComponentMarkupNode;
		node: Element;
		src: string;
		index: number;
		iframeData: IFrameData;
	}) => Promise<void>;
}
