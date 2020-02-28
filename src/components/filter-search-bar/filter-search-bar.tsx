import React from "react";
import styles from "./filter-search-bar.module.scss";
import { SearchField } from "./search-field";
import { FilterListbox } from "./filter-listbox";
import { WordCount } from "./word-count";

interface FilterSearchBarProps {
	showWordCount?: boolean;
	numberOfArticles?: number;
	wordCount?: number;
	tags: string[];
}
export const FilterSearchBar = ({
	showWordCount = false,
	numberOfArticles,
	wordCount,
	tags
}: FilterSearchBarProps) => {
	return (
		<div className={styles.iconContainer}>
			<SearchField className={styles.searchField} />
			<div className={styles.midContainer}>
				{showWordCount && (
					<WordCount
						wordCount={wordCount}
						numberOfArticles={numberOfArticles}
					/>
				)}
			</div>
			<FilterListbox className={styles.filterField} tags={tags} />
		</div>
	);
};
