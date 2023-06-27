import style from "./post-card.module.scss";
import { PostInfo } from "types/index";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { Chip } from "components/index";
import date from "src/icons/date.svg?raw";
import authors from "src/icons/authors.svg?raw";

interface PostCardProps {
	post: PostInfo;
	class?: string;
	unicornProfilePicMap: ProfilePictureMap;
}

function PostCardMeta({ post, unicornProfilePicMap }: PostCardProps) {
	return (
		<>
			<div className={style.postDataContainer}>
				<div className={style.authorListContainer}>
					<div
						className={style.cardIcon}
						dangerouslySetInnerHTML={{ __html: authors }}
					/>
					<ul className={style.authorList}>
						{post.authorsMeta.map((author, i, arr) => (
							<li>
								<a
									class={`text-style-body-small-bold ${style.authorName}`}
									href={`/authors/${author.id}`}
								>
									{author.name}
									{i !== arr.length - 1 && <span aria-hidden="true">, </span>}
								</a>
							</li>
						))}
					</ul>
				</div>
				<p className={style.dateAndWordCount}>
					<span
						className={style.cardIcon}
						dangerouslySetInnerHTML={{ __html: date }}
					/>
					<span class={`text-style-body-small-bold ${style.publishedDate}`}>
						{post.publishedMeta}
					</span>
					<span class={`text-style-body-small ${style.separatorDot}`}>•</span>
					<span class={`text-style-body-small ${style.wordCount}`}>
						{post.wordCount} words
					</span>
				</p>
			</div>
			<p
				className={`text-style-body-medium ${style.description}`}
				dangerouslySetInnerHTML={{ __html: post.description }}
			></p>
			<ul className={style.cardList}>
				{post.tags.map((tag) => (
					<li>
						<Chip href={`/search?q=${tag}`}>{tag}</Chip>
					</li>
				))}
			</ul>
		</>
	);
}

export const PostCardExpanded = ({
	post,
	class: className = "",
	unicornProfilePicMap,
}: PostCardProps) => {
	return (
		<li
			// @ts-ignore
			onclick={`location.href='/posts/${post.slug}'`}
			class={`${className}`}
		>
			<img
				loading="lazy"
				src={post.bannerImg}
				alt="Computer code and text on a computer screen"
			/>
			<a href={`/posts/${post.slug}`}>
				<h2>{post.title}</h2>
			</a>
			<PostCardMeta post={post} unicornProfilePicMap={unicornProfilePicMap} />
		</li>
	);
};

export const PostCard = ({
	post,
	class: className = "",
	unicornProfilePicMap,
}: PostCardProps) => {
	return (
		<li
			// @ts-ignore
			onclick={`location.href='/posts/${post.slug}'`}
			class={`${className}`}
		>
			<a href={`/posts/${post.slug}`}>
				<h2>{post.title}</h2>
			</a>
			<PostCardMeta post={post} unicornProfilePicMap={unicornProfilePicMap} />
		</li>
	);
};
