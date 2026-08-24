import style from "./post-card.module.scss";
import type { PersonInfo } from "#types/index.ts";
import { Chip } from "#components/index.ts";
import date from "#src/icons/date.svg?raw";
import authorsSvg from "#src/icons/authors.svg?raw";
import { getHrefContainerProps } from "#utils/href-container-script.ts";
import { buildSearchQuery } from "#src/views/search/search.ts";
import type { PostInfoWithBanner } from "./types.ts";

interface PostCardProps {
	headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	post: PostInfoWithBanner;
	authors: Pick<PersonInfo, "id" | "name">[];
	class?: string;
	i18n: PostCardI18n;
}

export interface PostCardI18n {
	authorsLabel: string;
	tagsLabel: string;
	wordCountLabel: string;
}

function PostCardMeta({ post, authors, i18n }: PostCardProps) {
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
						aria-label={i18n.authorsLabel}
					>
						{authors.map((author, i, arr) => (
							<li key={author.id} class="text-style-body-small-bold">
								<a
									className={`${style.authorName}`}
									href={`/people/${author.id}`}
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
							{i18n.wordCountLabel.replace(
								"%s",
								post.wordCount.toLocaleString(post.locale),
							)}
						</span>
					</span>
				</p>
			</div>
			<p
				className={`text-style-body-medium ${style.description}`}
				dangerouslySetInnerHTML={{ __html: post.description }}
			/>
			<div className={style.spacer} />
			<ul className={style.cardList} aria-label={i18n.tagsLabel} role="list">
				{post.tags.map((tag) => (
					<li key={tag}>
						<Chip
							href={`/search?${buildSearchQuery({ searchQuery: "*", filterTags: [tag] })}`}
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
	i18n,
}: PostCardProps & { imageLoading?: "eager" | "lazy" }) => {
	return (
		<li
			{...getHrefContainerProps(`/posts/${post.slug}`)}
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
				<a href={`/posts/${post.slug}`} className={`${style.postHeaderBase}`}>
					<HeadingTag className={`text-style-headline-2`}>
						{post.title}
					</HeadingTag>
				</a>
				<PostCardMeta post={post} authors={authors} i18n={i18n} />
			</div>
		</li>
	);
};

export const PostCard = ({
	post,
	authors,
	headingTag: HeadingTag = "h2",
	class: className = "",
	i18n,
}: PostCardProps) => {
	return (
		<li
			{...getHrefContainerProps(`/posts/${post.slug}`)}
			className={`${className} ${style.postContainer} ${style.postBase} ${style.regularPostContainer}`}
		>
			<a href={`/posts/${post.slug}`} className={`${style.postHeaderBase}`}>
				<HeadingTag className={`text-style-headline-5`}>
					{post.title}
				</HeadingTag>
			</a>
			<PostCardMeta post={post} authors={authors} i18n={i18n} />
		</li>
	);
};
