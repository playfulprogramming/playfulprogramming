import info from "#src/assets/icons/info.svg?raw";
import style from "./search-result-count.module.scss";
import { forwardRef } from "preact/compat";
import { getLocale } from "#src/paraglide/runtime.js";
import { m } from "#src/paraglide/messages.js";

interface SearchResultCountProps {
	numberOfPosts?: number;
	numberOfCollections?: number;
}

export const SearchResultCount = forwardRef<
	HTMLDivElement | null,
	SearchResultCountProps
>(({ numberOfPosts, numberOfCollections }, ref) => {
	const locale = getLocale();
	const posts = numberOfPosts
		? numberOfPosts === 1
			? m.search_count_post_one({
					count: numberOfPosts.toLocaleString(locale),
				})
			: m.search_count_post_other({
					count: numberOfPosts.toLocaleString(locale),
				})
		: undefined;
	const collections = numberOfCollections
		? numberOfCollections === 1
			? m.search_count_collection_one({
					count: numberOfCollections.toLocaleString(locale),
				})
			: m.search_count_collection_other({
					count: numberOfCollections.toLocaleString(locale),
				})
		: undefined;
	const resultCount =
		posts && collections
			? m.search_count_mixed({ posts, collections })
			: (posts ?? collections ?? "");

	return (
		<div className={style.container} ref={ref} tabIndex={-1}>
			<span
				className={style.icon}
				aria-hidden={true}
				dangerouslySetInnerHTML={{ __html: info }}
			/>
			<h2 className={`text-style-body-large-bold ${style.text}`}>
				{m.search_count_summary({ resultCount })}
			</h2>
		</div>
	);
});
