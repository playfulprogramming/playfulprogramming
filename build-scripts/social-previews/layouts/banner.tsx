import * as React from "preact";
import { ComponentProps, Layout } from "../base";
import style from "./banner-css";
import classnames from "classnames";
import tags from "../../../content/data/tags.json";
import fs from "fs";

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

	const tagInfo = post.tags.map(tag => tags[tag])
		.filter(t => t?.image && t?.shownWithBranding)[0];

	const tagSvg = tagInfo
		? fs.readFileSync("public" + tagInfo.image, "utf-8")
		: fs.readFileSync("public/stickers/role_devops.svg", "utf-8");

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
				<div
					class="rect"
					style="--z: 60px; --x: -80px; --y: -150px;"
					dangerouslySetInnerHTML={{ __html: tagSvg }}
				/>
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
