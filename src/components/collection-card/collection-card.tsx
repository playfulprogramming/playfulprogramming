import style from "./collection-card.module.scss";
import { Button } from "#components/index.ts";
import type { CollectionInfo } from "#types/CollectionInfo.ts";
import forward from "#src/icons/arrow_right.svg?raw";
import { Picture as UUPicture } from "#components/image/picture.tsx";
import type { PersonInfo } from "#types/PersonInfo.ts";

import { m } from "#src/paraglide/messages.js";
import { getLocale, localizeHref } from "#src/paraglide/runtime.js";

interface CollectionCardProps {
	collection: CollectionInfo;
	authors: PersonInfo[];
	headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CollectionCard = ({
	collection,
	authors,
	headingTag: HeadingTag = "h2",
}: CollectionCardProps) => {
	const locale = getLocale();
	const coverImgAspectRatio =
		collection.coverImgMeta.width / collection.coverImgMeta.height;

	// adjust the image width to ensure its height=240px
	// (i.e. it shouldn't get upscaled/downscaled with `object-fit: cover`)
	const coverImgWidth = Math.max(160, Math.ceil(240 * coverImgAspectRatio));

	return (
		<li className={style.container}>
			<div className={style.topRow}>
				<UUPicture
					src={collection.coverImgMeta.relativeServerPath}
					width={coverImgWidth}
					height={240}
					alt=""
					class={style.coverImg}
				/>
				<div>
					<HeadingTag className={`text-style-headline-4 ${style.title}`}>
						{collection.title}
					</HeadingTag>
					<p className={`text-style-body-medium`}>{collection.description}</p>
				</div>
			</div>
			<div className={style.bottomRow}>
				<ul
					className={`unlist-inline ${style.authorList}`}
					role="list"
					aria-label={m.label_collection_authors()}
				>
					{authors?.map((author) => (
						<li key={author.id}>
							<a
								href={localizeHref(`/people/${author.id}`, {
									locale: author.locale,
								})}
								className={`text-style-button-regular ${style.authorListItem}`}
							>
								<UUPicture
									src={author.profileImgMeta.relativeServerPath}
									width={24}
									height={24}
									alt=""
									class={style.authorImage}
								/>
								<span>{author.name}</span>
							</a>
						</li>
					))}
				</ul>

				<Button
					href={localizeHref(`/collections/${collection.slug}`, {
						locale: collection.locale,
					})}
					rightIcon={
						<span
							className={style.forwardIcon}
							dangerouslySetInnerHTML={{ __html: forward }}
						/>
					}
				>
					{collection.customChaptersText ?? (
						<>
							{m.title_n_chapters({
								count: collection.postCount.toLocaleString(locale),
							})}
						</>
					)}
				</Button>
			</div>
		</li>
	);
};
