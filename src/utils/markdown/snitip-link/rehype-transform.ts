import { Root } from "hast";
import { SKIP, visit } from "unist-util-visit";
import { Plugin } from "unified";
import { Element } from "hast";
import { SnitipLink } from "./SnitipLink";
import { SnitipInfo } from "types/SnitipInfo";
import { MarkdownVFile } from "../types";
import { logError } from "../logger";
import { getSnitipById } from "utils/api";

export const rehypeSnitipLinks: Plugin<[], Root> = () => {
	return (tree, vfile) => {
		visit(
			tree,
			{ type: "element", tagName: "a" },
			(node: Element, index, parent) => {
				if (!parent || index === undefined) {
					return;
				}

				const href = String(node.properties.href);
				if (!href.startsWith("pfp-snitip:")) {
					return;
				}

				const snitipType = href[11];
				const snitipId = href.substring(12);

				let snitip: SnitipInfo | undefined;
				if (snitipType === "#") {
					snitip = (vfile as MarkdownVFile).data.snitips.get(snitipId);
				}

				// If the snitip is not found in the document, try to resolve a global snitip
				if (!snitip) {
					snitip = getSnitipById(snitipId);
					if (snitip) {
						(vfile as MarkdownVFile).data.snitips.set(snitipId, snitip);
					}
				}

				// If the snitip is not found anywhere, error
				if (!snitip) {
					logError(
						vfile,
						node,
						`Could not resolve snitip link to any known snitips: ${href}`,
					);
					return;
				}

				parent.children[index] = SnitipLink({
					id: snitipId,
					snitip,
					children: node.children,
				});

				return SKIP;
			},
		);
	};
};
