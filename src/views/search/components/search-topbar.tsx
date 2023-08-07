import style from "./search-topbar.module.scss";
import { SearchInput } from "components/input/input";
import { Button, IconOnlyButton } from "components/button/button";
import filter from "src/icons/filter.svg?raw";
import forward from "src/icons/arrow_right.svg?raw";
import { Item, Option, Select } from "components/select/select";
import {
	RadioButton,
	RadioButtonGroup,
} from "components/button-radio-group/button-radio-group";

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
					id="search-bar"
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
			<div className={`${style.dividerLine} ${style.topBarDivider}`} />
			<RadioButtonGroup
				className={style.topBarButtonsContentToDisplay}
				value={contentToDisplay}
				label={"Content to display"}
				onChange={(val) => setContentToDisplay(val as "all")}
			>
				<RadioButton aria-label={"All"} value={"all"}>
					All
				</RadioButton>
				<RadioButton value={"articles"}>Articles</RadioButton>
				<RadioButton value={"collections"}>Collections</RadioButton>
			</RadioButtonGroup>
			<div class={style.orderSelectContainer}>
				<div class={style.dividerLine} />
				<div class={style.filterAndOrderSelectDiv}>
					<Button
						onClick={() => setFilterIsDialogOpen(true)}
						tag="button"
						type="button"
						leftIcon={
							<span
								className={style.filterIconContainer}
								dangerouslySetInnerHTML={{ __html: filter }}
							></span>
						}
					>
						Filter
					</Button>
					<Select
						label={"Order"}
						selectedKey={sort}
						onSelectionChange={(v) => setSort(v)}
					>
						<Item key={"newest"}>Newest</Item>
						<Item key={"oldest"}>Oldest</Item>
					</Select>
				</div>
			</div>
			<div className={style.topBarSmallTabletButtons}>
				<div role="group" className={style.topBarSmallTabletButtonsToggle}>
					<Button
						onClick={() => setSort("newest")}
						aria-selected={sort === "newest"}
						tag="button"
						type="button"
						variant={sort === "newest" ? "primary-emphasized" : "primary"}
					>
						Newest
					</Button>
					<Button
						onClick={() => setSort("oldest")}
						aria-selected={sort === "oldest"}
						tag="button"
						type="button"
						variant={sort === "oldest" ? "primary-emphasized" : "primary"}
					>
						Oldest
					</Button>
				</div>
				<IconOnlyButton
					tag="button"
					type="button"
					onClick={() => setFilterIsDialogOpen(true)}
				>
					<span
						className={style.filterIconContainer}
						dangerouslySetInnerHTML={{ __html: filter }}
					></span>
				</IconOnlyButton>
			</div>
			<div class={`${style.dividerLine} ${style.tabletSmallTopBarDivider}`} />
		</div>
	);
};
