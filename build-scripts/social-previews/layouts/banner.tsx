import * as React from "preact";
import { readFileAsBase64 } from "../utils";
import { ComponentProps, Layout } from "../base";
import style from "./banner-css";
import classnames from "classnames";

const tagStickers: Record<string, string> = {
	default: readFileAsBase64("public/stickers/role_devops.png"),
	"html,webdev": readFileAsBase64("public/stickers/html.png"),
	vue: readFileAsBase64("public/stickers/vue.png"),
	"documentation,opinion": readFileAsBase64("public/stickers/role_author.png"),
	"computer science,bash,javascript": readFileAsBase64(
		"public/stickers/role_developer.png",
	),
	design: readFileAsBase64("public/stickers/role_designer.png"),
	rust: readFileAsBase64("public/stickers/ferris.png"),
	git: readFileAsBase64("public/stickers/git.png"),
};

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

	let tagImg = tagStickers["default"];
	for (const tag of post.tags) {
		const key = Object.keys(tagStickers).find((k) =>
			k.split(",").includes(tag),
		);
		if (key) {
			tagImg = tagStickers[key];
			break;
		}
	}

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
					<pre dangerouslySetInnerHTML={{ __html: postHtml }} />
					<div class="tags">
						{post.tags.map((tag) => (
							<span key={tag}>{tag}</span>
						))}
					</div>
				</div>
				<div class="rect" style="--z: 60px; --x: -80px; --y: -150px;">
					<img src={tagImg} />
				</div>
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
