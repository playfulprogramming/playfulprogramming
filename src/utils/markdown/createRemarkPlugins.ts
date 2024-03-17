import remarkEmbedderDefault, {
	RemarkEmbedderOptions,
} from "@remark-embedder/core";
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from "remark-unwrap-images";
import { TwitchTransformer } from "./remark-embedder-twitch";
import remarkTwoslashDefault from "remark-shiki-twoslash";
import oembedTransformerDefault from "@remark-embedder/transformer-oembed";
import { UserConfigSettings } from "shiki-twoslash";
import { MarkdownConfig } from "./constants";
import { PluggableList } from "unified";
import remarkMdx from "remark-mdx";

// https://github.com/shikijs/twoslash/issues/147
const remarkTwoslash =
	(remarkTwoslashDefault as never as { default: typeof remarkTwoslashDefault })
		.default ?? remarkTwoslashDefault;

const remarkEmbedder =
	(remarkEmbedderDefault as never as { default: typeof remarkEmbedderDefault })
		.default ?? remarkEmbedderDefault;

const oembedTransformer =
	(
		oembedTransformerDefault as never as {
			default: typeof oembedTransformerDefault;
		}
	).default ?? oembedTransformerDefault;

export function createRemarkPlugins(config: MarkdownConfig): PluggableList {
	return [
		remarkGfm,
		// Remove complaining about "div cannot be in p element"
		remarkUnwrapImages,
		/* start remark plugins here */
		[
			remarkEmbedder,
			{
				transformers: [oembedTransformer, TwitchTransformer],
			} as RemarkEmbedderOptions,
		],
		[
			remarkTwoslash,
			{
				themes: ["css-variables"],
			} as UserConfigSettings,
		],
	];
}
