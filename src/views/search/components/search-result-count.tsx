import info from "#src/icons/info.svg?raw";
import style from "./search-result-count.module.scss";
import { forwardRef } from "preact/compat";
import type { Languages } from "#types/index.ts";
import type { Translate } from "#utils/translations.ts";

interface SearchResultCountProps {
	numberOfPosts?: number;
	numberOfCollections?: number;
	locale: Languages;
	translate: Translate;
}

export const SearchResultCount = forwardRef<
	HTMLDivElement | null,
	SearchResultCountProps
>(({ numberOfPosts, numberOfCollections, locale, translate }, ref) => {
	const posts = numberOfPosts
		? translate(
				numberOfPosts === 1
					? "search.count.post_one"
					: "search.count.post_other",
				numberOfPosts.toLocaleString(locale),
			)
		: undefined;
	const collections = numberOfCollections
		? translate(
				numberOfCollections === 1
					? "search.count.collection_one"
					: "search.count.collection_other",
				numberOfCollections.toLocaleString(locale),
			)
		: undefined;
	const resultCount =
		posts && collections
			? translate("search.count.mixed", posts, collections)
			: (posts ?? collections ?? "");

	return (
		<div className={style.container} ref={ref} tabIndex={-1}>
			<span
				className={style.icon}
				aria-hidden={true}
				dangerouslySetInnerHTML={{ __html: info }}
			/>
			<h2 className={`text-style-body-large-bold ${style.text}`}>
				{translate("search.count.summary", resultCount)}
			</h2>
		</div>
	);
});
