import style from "./search-topbar.module.scss";
import { SearchInput } from "components/input/input";
import { Button, IconOnlyButton } from "components/button/button";
import filter from "src/icons/filter.svg?raw";
import forward from "src/icons/arrow_right.svg?raw";

interface SearchTopbarProps {
	onSearch: (search: string) => void;
	search: string;
	setSearch: (search: string) => void;
	setContentToDisplay: (content: "all" | "articles" | "collections") => void;
	contentToDisplay: "all" | "articles" | "collections";
	setSort: (sort: "newest" | "oldest") => void;
	sort: "newest" | "oldest";
	setFilterIsDialogOpen: (isOpen: boolean) => void;
}

export const SearchTopbar = ({
	onSearch,
	search,
	setSearch,
	setContentToDisplay,
	contentToDisplay,
	setSort,
	sort,
	setFilterIsDialogOpen,
}: SearchTopbarProps) => {
	return (
		<div className={style.topBar}>
			<form
				className={style.searchbarRow}
				onSubmit={(e) => {
					e.preventDefault();
					onSearch(search);
				}}
			>
				<SearchInput
					class={style.searchbar}
					usedInPreact={true}
					value={search}
					onBlur={(e) => {
						const newVal = (e.target as HTMLInputElement).value;
						setSearch(newVal);
						onSearch(newVal);
					}}
					onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
				/>
				<IconOnlyButton
					class={style.searchButton}
					tag="button"
					type="submit"
					dangerouslySetInnerHTML={{ __html: forward }}
					children={null}
				/>
			</form>
			<div className={style.topBarDivider} />
			<div className={style.topBarButtonsContentToDisplay} role="group">
				<Button
					onClick={() => setContentToDisplay("all")}
					aria-selected={contentToDisplay === "all"}
					tag="button"
					variant={
						contentToDisplay === "all" ? "primary-emphasized" : "primary"
					}
				>
					All
				</Button>
				<Button
					onClick={() => setContentToDisplay("articles")}
					aria-selected={contentToDisplay === "articles"}
					tag="button"
					variant={
						contentToDisplay === "articles" ? "primary-emphasized" : "primary"
					}
				>
					Articles
				</Button>
				<Button
					onClick={() => setContentToDisplay("collections")}
					aria-selected={contentToDisplay === "collections"}
					tag="button"
					variant={
						contentToDisplay === "collections"
							? "primary-emphasized"
							: "primary"
					}
				>
					Collections
				</Button>
			</div>
			<div className={style.topBarSmallTabletButtons}>
				<div role="group" className={style.topBarSmallTabletButtonsToggle}>
					<Button
						onClick={() => setSort("newest")}
						aria-selected={sort === "newest"}
						tag="button"
						variant={sort === "newest" ? "primary-emphasized" : "primary"}
					>
						Newest
					</Button>
					<Button
						onClick={() => setSort("oldest")}
						aria-selected={sort === "oldest"}
						tag="button"
						variant={sort === "oldest" ? "primary-emphasized" : "primary"}
					>
						Oldest
					</Button>
				</div>
				<IconOnlyButton onClick={() => setFilterIsDialogOpen(true)}>
					<span
						className={style.filterIconContainer}
						dangerouslySetInnerHTML={{ __html: filter }}
					></span>
				</IconOnlyButton>
			</div>
		</div>
	);
};
