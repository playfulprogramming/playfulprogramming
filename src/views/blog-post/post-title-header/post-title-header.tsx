import "./post-title-header.scss";
import { PostInfo } from "types/index";
import { Chip } from "components/index";
import dayjs from "dayjs";
import { buildSearchQuery } from "../../../utils/search";
import date from "src/icons/date.svg?raw";
import authors from "src/icons/authors.svg?raw";
import website from "src/icons/website.svg?raw";

interface PostTitleHeaderProps {
	post: Pick<PostInfo, "title" | "published" | "edited" | "originalLink" | "authorsMeta" | "tags">;
}

export function PostTitleHeader({ post }: PostTitleHeaderProps) {
	const publishedStr = dayjs(post.published).format("MMMM D, YYYY");
	const editedStr = post.edited && dayjs(post.edited).format("MMMM D, YYYY");

	const originalLinkStr = post.originalLink && new URL(post.originalLink).host;

	return (
		<section class="post-title-header">
			<h1 class={`text-style-headline-1 title`}>{post.title}</h1>

			<div class="details">
				<div class="date">
					<div class="date__published">
						<div
							style="display: contents;"
							dangerouslySetInnerHTML={{ __html: date }}
							aria-hidden
						/>
						<p class="text-style-button-regular">{publishedStr}</p>
					</div>

					{
						editedStr && editedStr !== publishedStr ? (
							<p class={`text-style-button-regular date__edited`}>
								Last updated: {editedStr}
							</p>
						) : null
					}
				</div>

				<div class="authors">
					<div
						style="display: contents;"
						dangerouslySetInnerHTML={{ __html: authors }}
						aria-hidden
					/>
					<ul aria-label="Post authors" role="list" class="authors__list">
						{
							post.authorsMeta.map((author, i) => (
								<li class="text-style-button-regular">
									<a href={`/unicorns/${author.id}`}>
										{[author.name, i + 1 < post.authorsMeta.length ? "," : ""]}
									</a>
								</li>
							))
						}
					</ul>
				</div>

				{
					post.originalLink ? (
						<div class="originalLink">
							<div
								style="display: contents;"
								dangerouslySetInnerHTML={{ __html: website }}
								aria-hidden
							/>
							<p class="text-style-button-regular">
								Original link:
								<a
									href={post.originalLink}
									target="_blank"
									rel="nofollow noopener noreferrer"
								>
									{originalLinkStr}
								</a>
							</p>
						</div>
					) : null
				}
			</div>

			<ul aria-label="Post tags" role="list" class="tags">
				{
					post.tags?.map((tag) => (
						<li>
							<Chip href={`/search?${buildSearchQuery({ filterTags: [tag] })}`}>
								{tag}
							</Chip>
						</li>
					))
				}
			</ul>
		</section>
	);
}
