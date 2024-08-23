import * as React from "preact";
import { ComponentProps, Layout } from "../base";
import style from "./banner-css";
import classnames from "classnames";
import tags from "../../../content/data/tags.json";
import fs from "fs";
import { isDefined } from "utils/is-defined";
import { TagInfo } from "types/TagInfo";

const TAG_SVG_DEFAULT = fs.readFileSync(
	"public/stickers/role_devops.svg",
	"utf-8",
);
const tagsMap = new Map<string, TagInfo>(Object.entries(tags));

function BannerCodeScreen({
	post,
	postHtml,
	blur,
}: {
	post: ComponentProps["post"];
	postHtml: string;
	blur?: boolean;
}) {
	const rotX = (post.description.length % 20) - 10;
	const rotY = (post.title.length * 3) % 20;

	const tagInfo = post.tags
		.map((tag) => tagsMap.get(tag))
		.filter(isDefined)
		.filter((t) => t.emoji || (t.image && t.shownWithBranding))[0];

	const tagSvg = tagInfo?.image
		? fs.readFileSync("public" + tagInfo.image, "utf-8")
		: TAG_SVG_DEFAULT;

	const theme = post.title.length % 3;

	return (
		<>
			<div
				class={classnames(
					"absoluteFill",
					"codeScreenBg",
					blur && "blur",
					"theme-" + theme,
				)}
				style={`--rotX: ${rotX}deg; --rotY: ${rotY}deg; --left: ${rotY}%;`}
			>
				<div class="codeScreen">
					<div dangerouslySetInnerHTML={{ __html: postHtml }} />
					<div class="tags">
						{post.tags.map((tag) => (
							<span key={tag}>{tag}</span>
						))}
					</div>
				</div>
				{tagInfo?.emoji ? (
					<div class="rect emoji" style="--z: 60px; --x: -80px; --y: -150px;">
						{tagInfo.emoji}
					</div>
				) : (
					<div
						class="rect"
						style="--z: 60px; --x: -80px; --y: -150px;"
						dangerouslySetInnerHTML={{ __html: tagSvg }}
					/>
				)}
			</div>
		</>
	);
}

function Banner({ post, postHtml }: ComponentProps) {
	return (
		<>
			<BannerCodeScreen post={post} postHtml={postHtml} />
			<div
				className="absoluteFill codeScreenOverlay"
				style={{
					zIndex: -1,
				}}
			/>
		</>
	);
}

export default {
	name: "banner",
	css: style,
	Component: Banner,
} as Layout;
