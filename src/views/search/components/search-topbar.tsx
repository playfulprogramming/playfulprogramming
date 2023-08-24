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
import { StateUpdater } from "preact/hooks";

interface SearchTopbarProps {
	onSubmit: (search: string) => void;
	onBlur: (search: string) => void;
	search: string;
	setSearch: (search: string) => void;
	setContentToDisplay: (content: "all" | "articles" | "collections") => void;
	contentToDisplay: "all" | "articles" | "collections";
	sort: "newest" | "oldest" | null;
	setSort: (sortBy: "newest" | "oldest" | null) => void;
	setFilterIsDialogOpen: (isOpen: boolean) => void;
}

export const SearchTopbar = ({
	onSubmit,
	onBlur,
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
					onSubmit(search);
				}}
			>
				<SearchInput
					id="search-bar"
					aria-label="Search"
					aria-description={"Results will update as you type"}
					class={style.searchbar}
					usedInPreact={true}
					value={search}
					onBlur={(e) => {
						const newVal = (e.target as HTMLInputElement).value;
						setSearch(newVal);
						onBlur(newVal);
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
				testId={"content-to-display-group-topbar"}
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
						label={"Post sort order"}
						defaultValue={"Sort order"}
						selectedKey={sort}
						onSelectionChange={(v) => {
							if (!v) {
								setSort(null);
								return;
							}
							setSort(v);
						}}
					>
						<Item key={""}>Default</Item>
						<Item key={"newest"}>Newest</Item>
						<Item key={"oldest"}>Oldest</Item>
					</Select>
				</div>
			</div>
			<div className={style.topBarSmallTabletButtons}>
				<RadioButtonGroup
					testId={"sort-order-group-topbar"}
					className={style.topBarSmallTabletButtonsToggle}
					value={sort}
					label={"Sort order"}
					onChange={(val) => {
						if (sort === val) {
							setSort(null);
							return;
						}

						setSort(val as "newest");
					}}
				>
					<RadioButton value={"newest"}>Newest</RadioButton>
					<RadioButton value={"oldest"}>Oldest</RadioButton>
				</RadioButtonGroup>
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
