import * as React from "preact";
import { readFileAsBase64 } from "../utils";
import { ComponentProps, Layout } from "../base";
import style from "./twitter-preview-css";
import * as fs from "fs";

export function splitSentence(str: string): [string, string] {
	const splitStr = str.split(" ");
	const splitBy = (
		regex: RegExp,
		matchLast: boolean = true,
	): [string, string] | null => {
		const matches = splitStr.map((word, i) => ({ reg: regex.exec(word), i }));
		const match = (matchLast ? matches.reverse() : matches)
			.slice(1, -1)
			.find(({ reg }) => !!reg);

		// if match is not found, fail
		if (!match || !match.reg) return null;

		const firstHalf = [
			...splitStr.slice(0, match.i),
			match.reg.input.substring(0, match.reg.index),
		].join(" ");
		const secondHalf = [match.reg[0], ...splitStr.slice(match.i + 1)].join(" ");
		return [firstHalf, secondHalf];
	};

	let ret;
	// try to split by "Topic[: Attribute]" or "Topic [- Attribute]" (hyphens/colons)
	if ((ret = splitBy(/(?<=^\w+):$|^[-—]$/))) return ret;
	// try to split by "Attribute in [Topic, Topic, and Topic]" (commas)
	if ((ret = splitBy(/^\w+,$/, false))) return ret;
	// try to split by "Topic['s Attribute]" (apostrophe)
	if ((ret = splitBy(/(?<=^\w+\'s?)$/))) return ret;
	// try to split by "Attribute [in Topic]" (lowercase words)
	if ((ret = splitBy(/^[a-z][A-Za-z]*$/))) return ret;
	// otherwise, don't split the string
	return [str, ""];
}

const unicornUtterancesHead = fs.readFileSync("src/assets/unicorn_utterances_sticker.svg", "utf-8");

interface TwitterCodeScreenProps {
	title: string;
	html: string;
}

const TwitterCodeScreen = ({ title, html }: TwitterCodeScreenProps) => {
	const rotations = [
		"rotateX(-17deg) rotateY(32deg) rotateZ(-3deg) translate(16%, 0%)",
		"rotateX(5deg) rotateY(35deg) rotateZ(345deg) translate(18%, 0)",
		"rotateX(15deg) rotateY(25deg) rotateZ(12deg) translate(3%, -15%)",
	];

	// use second char of title as "deterministic" random value
	const transform = rotations[title.charCodeAt(1) % rotations.length];

	return (
		<div className={`absoluteFill codeScreenBg`}>
			<div
				className="absoluteFill codeScreen"
				style={`transform: ${transform};`}
			>
				<div className="absoluteFill" dangerouslySetInnerHTML={{ __html: html }} />
			</div>
		</div>
	);
};
const TwitterLargeCard = ({
	post,
	postHtml,
	width,
	authorImageMap,
}: ComponentProps) => {
	const title = post.title;
	const [firstHalfTitle, secondHalfTitle] = splitSentence(title);

	return (
		<>
			<TwitterCodeScreen title={post.title} html={postHtml} />
			<div className="absoluteFill codeScreenOverlay" />
			<div className="absoluteFill codeScreenGrain" />
			<div className="absoluteFill backgroundColor content">
				<div style="flex-grow: 1; text-align: right;">
					<div class="url">unicorn-utterances.com</div>
				</div>
				<h1
					style={{
						maxWidth: "100%",
						fontSize: `clamp(300%, 4.5rem, ${
							Math.round(width / title.length) * 3
						}px)`,
					}}
				>
					{title}
				</h1>
				<div class="row">
					<div class="authorImages">
						{post.authors.map((author) => (
							<img
								key={author}
								src={authorImageMap[author]}
								alt=""
								className="authorImage"
								height={90}
								width={90}
							/>
						))}
					</div>
					<div class="postInfo">
						<span class="authors">
							{post.authorsMeta.map((author) => author.name).join(", ")}
						</span>
						<span class="date">
							{post.publishedMeta} &nbsp;&middot;&nbsp; {post.wordCount.toLocaleString("en")} words
						</span>
					</div>
					<div
						class="unicorn"
						dangerouslySetInnerHTML={{ __html: unicornUtterancesHead }}
					/>
				</div>
			</div>
		</>
	);
};

export default {
	name: "twitter-preview",
	css: style,
	Component: TwitterLargeCard,
} as Layout;
