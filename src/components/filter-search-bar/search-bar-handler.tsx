import { useLayoutEffect, useState } from "preact/hooks";
import { Pagination } from "components/pagination/pagination";
import { PostCard } from "components/post-card/post-card";
import { PostInfo } from "types/PostInfo";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";

interface SearchBarHandlerProps {
	posts: PostInfo[];
	unicornProfilePicMap: ProfilePictureMap;
	totalPosts: number;
}

const PAGE_SIZE = 8;

export const SEARCH_PAGE_KEY = "searchPage";

export const getPageFromQueryParams = () => {
	// This will always run on the client
	const searchParams = new URLSearchParams(location.search);
	const pageStr = searchParams.get(SEARCH_PAGE_KEY);
	return pageStr ? Number(pageStr) : null;
};

export const SearchBarHandler = ({
	posts,
	unicornProfilePicMap,
	totalPosts,
}: SearchBarHandlerProps) => {
	// Replace this initial value with parsing the QS of the browser and getting `searchPage`
	const [page, setPage] = useState(getPageFromQueryParams() ?? 1);

	useLayoutEffect(() => {
		let previousUrl = "";
		const observer = new MutationObserver(function (mutations) {
			if (window.location.href !== previousUrl) {
				previousUrl = window.location.href;
				setPage(getPageFromQueryParams() ?? 1);
			}
		});
		const config = { subtree: true, childList: true };

		observer.observe(document, config);
		return () => observer.disconnect();
	}, []);

	const currentPosts = posts.slice(
		PAGE_SIZE * (page - 1),
		PAGE_SIZE * (page - 1) + PAGE_SIZE
	);

	return (
		<>
			<ul data-isPostList="true">
				{currentPosts.map((post) => (
					<PostCard unicornProfilePicMap={unicornProfilePicMap} post={post} />
				))}
			</ul>
			{totalPosts}
			{page}
			<Pagination
				rootURL={""}
				getPageHref={(pageNum: number) => {
					const url = new URL(window.location as never);
					url.searchParams.set(SEARCH_PAGE_KEY, '' + pageNum);
					return url.href;
				}}
				page={{
					total: totalPosts,
					currentPage: page,
					size: PAGE_SIZE,
				}}
			/>
		</>
	);
};
