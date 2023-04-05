import * as React from 'preact';
import { readFileAsBase64 } from '../utils';
import { ComponentProps, Layout } from '../base';
import style from './banner-css';
import classnames from 'classnames';

const unicornFile = readFileAsBase64("src/assets/unicorn_utterances_sticker_512.png");

function BannerCodeScreen({
	post,
	postHtml,
	blur,
}: {
	post: ComponentProps['post'],
	postHtml: string,
	blur?: boolean,
}) {
	const rotX = (post.description.length % 30) - 10;

	return <>
		<div class={classnames("absoluteFill", "codeScreenBg", blur && "blur")} style={`--rotX: ${rotX}deg;`}>
			<div class="codeScreen">
				<pre dangerouslySetInnerHTML={{ __html: postHtml }} />
				<div class="tags">
					{
						post.tags.map((tag) => (
							<span key={tag}>{tag}</span>
						))
					}
				</div>
			</div>
			<div class="rect" style="--z: 60px; --x: -80px; --y: -150px;">
				<img src={unicornFile} />
			</div>
		</div>
	</>;
}

function Banner({
	post,
	postHtml,
}: ComponentProps) {
	return <>
		<BannerCodeScreen post={post} postHtml={postHtml} />
		<BannerCodeScreen post={post} postHtml={postHtml} blur />
		<div
			className="absoluteFill codeScreenOverlay"
			style={{
				zIndex: -1,
			}}
		/>
	</>;
}

export default {
	name: "banner",
	css: style,
	Component: Banner,
} as Layout;
