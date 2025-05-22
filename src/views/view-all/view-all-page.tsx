import type { Page } from "astro";
import style from "./page.module.scss";
import { PostCardGrid } from "src/components/post-card/post-card-grid";
import { Pagination } from "components/pagination/pagination";

// Does this need to be moved to a communal location?
import { FilterDisplay } from "../search/components/filter-display";

import { PostInfo } from "types/PostInfo";
import { PersonInfo } from "types/PersonInfo";

interface ViewAllPageProps {
	posts: Array<PostInfo>;
	postAuthors: Map<string, PersonInfo>;
	page: Pick<Page, "currentPage" | "lastPage">;
}

export default function ViewAllPage({
	posts,
	postAuthors,
	page,
}: ViewAllPageProps) {
	return (
		<main class={style.fullPageContainer} data-hide-sidebar={false}>
			<h1 class="visually-hidden">Posts</h1>
			{/* <FilterDisplay
				isFilterDialogOpen={isFilterDialogOpen}
				setFilterIsDialogOpen={setFilterIsDialogOpen}
				tagCounts={tagCounts}
				authorCounts={authorCounts}
				peopleMap={peopleMap}
				selectedTags={query.filterTags}
				setSelectedTags={setSelectedTags}
				selectedAuthorIds={query.filterAuthors}
				setSelectedAuthorIds={setSelectedPeople}
				sort={query.sort}
				setSort={setSort}
				setContentToDisplay={setContentToDisplay}
				contentToDisplay={query.display}
				desktopStyle={{
					height: `calc(100vh - ${headerHeight}px)`,
					top: headerHeight,
					position: "sticky", 
					// this should be overflow: clip; to prevent the browser scrolling within the element when a filter checkbox is focused:
					// https://stackoverflow.com/q/75419337
					// https://github.com/playfulprogramming/playfulprogramming/issues/653
					overflow: "clip",
				}}
				searchString={query.searchQuery}
				isHybridSearch={isHybridSearch}
			/>*/}
			<div className={style.mainContents}>
				<section className={style.mainContentsInner}>
					<PostCardGrid
						expanded={true}
						aria-label="List of posts"
						postsToDisplay={posts}
						postAuthors={postAuthors}
					/>

					{/* We shouldn't pass the whole "page" object here, as this generates a huge JSON attribute for hydration */}
					<Pagination
						page={{ currentPage: page.currentPage, lastPage: page.lastPage }}
						rootURL="/page/"
					/>
				</section>
			</div>
		</main>
	);
}
