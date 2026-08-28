import style from "./post-card.module.scss";
import type { PersonInfo } from "#types/index.ts";
import { Chip } from "#components/index.ts";
import date from "#src/assets/icons/date.svg?raw";
import authorsSvg from "#src/assets/icons/authors.svg?raw";
import { getHrefContainerProps } from "#utils/href-container-script.ts";
import { buildSearchQuery } from "#src/views/search/search.ts";
import type { PostInfoWithBanner } from "./types.ts";
import { m } from "#src/paraglide/messages.js";
import { getLocale, localizeHref } from "#src/paraglide/runtime.js";

interface PostCardProps {
	headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	post: PostInfoWithBanner;
	authors: Pick<PersonInfo, "id" | "name" | "locale">[];
	class?: string;
}

function PostCardMeta({ post, authors }: PostCardProps) {
	const locale = getLocale();
	const searchHref = localizeHref("/search", { locale });

	return (
		<>
			<div className={style.postDataContainer}>
				<div className={style.authorListContainer}>
					<div
						aria-hidden
						className={style.cardIcon}
						dangerouslySetInnerHTML={{ __html: authorsSvg }}
					/>
					<ul
						className={style.authorList}
						role="list"
						aria-label={m.label_post_authors()}
					>
						{authors.map((author, i, arr) => (
							<li key={author.id} class="text-style-body-small-bold">
								<a
									className={`${style.authorName}`}
									href={localizeHref(`/people/${author.id}`, {
										locale: author.locale,
									})}
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
						aria-hidden
						className={style.cardIcon}
						dangerouslySetInnerHTML={{ __html: date }}
					/>
					<span>
						<span
							className={`text-style-body-small-bold ${style.publishedDate}`}
						>
							{post.publishedMeta}
						</span>
						<span className={`text-style-body-small ${style.separatorDot}`}>
							•
						</span>
						<span className={`text-style-body-small ${style.wordCount}`}>
							{m.title_n_words({
								count: post.wordCount.toLocaleString(locale),
							})}
						</span>
					</span>
				</p>
			</div>
			<p
				className={`text-style-body-medium ${style.description}`}
				dangerouslySetInnerHTML={{ __html: post.description }}
			/>
			<div className={style.spacer} />
			<ul
				className={style.cardList}
				aria-label={m.label_post_tags()}
				role="list"
			>
				{post.tags.map((tag) => (
					<li key={tag}>
						<Chip
							href={`${searchHref}?${buildSearchQuery({ searchQuery: "*", filterTags: [tag] })}`}
						>
							{tag}
						</Chip>
					</li>
				))}
			</ul>
		</>
	);
}

export const PostCardExpanded = ({
	post,
	authors,
	headingTag: HeadingTag = "h2",
	class: className = "",
	imageLoading = "lazy",
}: PostCardProps & { imageLoading?: "eager" | "lazy" }) => {
	const postHref = localizeHref(`/posts/${post.slug}`, {
		locale: post.locale,
	});

	return (
		<li
			{...getHrefContainerProps(postHref)}
			className={`${className} ${style.postBase} ${style.extendedPostContainer}`}
		>
			<div className={style.extendedPostImageContainer}>
				<img
					loading={imageLoading}
					crossorigin="anonymous"
					className={style.extendedPostImage}
					src={post.banner}
					alt=""
				/>
			</div>
			<div className={style.postContainer}>
				<a href={postHref} className={`${style.postHeaderBase}`}>
					<HeadingTag className={`text-style-headline-2`}>
						{post.title}
					</HeadingTag>
				</a>
				<PostCardMeta post={post} authors={authors} />
			</div>
		</li>
	);
};

export const PostCard = ({
	post,
	authors,
	headingTag: HeadingTag = "h2",
	class: className = "",
}: PostCardProps) => {
	const postHref = localizeHref(`/posts/${post.slug}`, {
		locale: post.locale,
	});

	return (
		<li
			{...getHrefContainerProps(postHref)}
			className={`${className} ${style.postContainer} ${style.postBase} ${style.regularPostContainer}`}
		>
			<a href={postHref} className={`${style.postHeaderBase}`}>
				<HeadingTag className={`text-style-headline-5`}>
					{post.title}
				</HeadingTag>
			</a>
			<PostCardMeta post={post} authors={authors} />
		</li>
	);
};
