import type { Locale } from "#src/paraglide/runtime.js";
import type { Element } from "hast";
import { SKIP, visit } from "unist-util-visit";
import type { Plugin } from "unified";
import { SnitipLink } from "./SnitipLink.tsx";
import type { SnitipInfo } from "#types/SnitipInfo.ts";
import type { MarkdownVFile } from "../types.ts";
import { logError } from "../logger.ts";
import { getSnitipById } from "#utils/api.ts";
import { createComponent, type PlayfulRoot } from "../components/components.ts";
import { v4 as uuidv4 } from "uuid";

const SNITIP_PROTOCOL = "pfp-snitip:";

interface RehypeSnitipLinksOptions {
	locale: Locale;
}

export const rehypeSnitipLinks: Plugin<
	[RehypeSnitipLinksOptions],
	PlayfulRoot
> = ({ locale }) => {
	return (tree, vfile) => {
		delete (vfile as MarkdownVFile).snitipScopeId;
		const scopeId = uuidv4();
		let transformedLinks = 0;

		visit(
			tree,
			{ type: "element", tagName: "a" },
			(node: Element, index, parent) => {
				if (!parent || index === undefined) {
					return;
				}

				const href = String(node.properties.href);
				if (!href.startsWith(SNITIP_PROTOCOL)) {
					return;
				}

				const reference = href.slice(SNITIP_PROTOCOL.length);
				const snitipId = reference.slice(1);
				if (!reference.startsWith("#") || !snitipId) {
					logError(vfile, node, `Invalid snitip link: ${href}`);
					return;
				}

				let snitip: SnitipInfo | undefined = (
					vfile as MarkdownVFile
				).data.snitips.get(snitipId);

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
					scopeId,
					snitip,
					locale,
					children: node.children,
				});
				transformedLinks += 1;

				return SKIP;
			},
		);

		if (transformedLinks > 0) {
			(vfile as MarkdownVFile).snitipScopeId = scopeId;
		}
	};
};

/**
 * Add the interactive support islands after heading collection/styling so
 * headings inside snitip bodies do not leak into the page table of contents.
 */
export const rehypeSnitipTemplates: Plugin<[], PlayfulRoot> = () => {
	return (tree, vfile) => {
		const { snitipScopeId: scopeId, data } = vfile as MarkdownVFile;
		if (!scopeId) return;

		// The component compiler uses an adjacent text node as the boundary
		// between ordinary HAST and a root component island.
		tree.children.push({ type: "text", value: "\n" });
		for (const snitip of data.snitips.values()) {
			tree.children.push(
				createComponent("SnitipTemplate", { scopeId, snitip }),
			);
		}
	};
};
