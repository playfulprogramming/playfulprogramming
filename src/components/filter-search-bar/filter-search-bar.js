import React from "react"
import styles from "./filter-search-bar.module.scss"
import { SearchField } from "./search-field"
import { FilterListbox } from "./filter-listbox"
import { WordCount } from "./word-count"

export const FilterSearchBar = ({ showWordCount = false }) => {
  const numberOfArticles = 3
  const wordCount = 4332
  return (
    <div className={styles.iconContainer}>
      <SearchField className={styles.searchField}/>
      <div className={styles.midContainer}>
        {showWordCount && <WordCount wordCount={wordCount} numberOfArticles={numberOfArticles}/>}
      </div>
      <FilterListbox className={styles.filterField} tags={[
        "Test",
        "Another",
        "One More Makes 3",
        "One More Makes 4",
        "One More Makes 5",
        "One More Makes 1235",
        "One More Makes 55",
      ]}/>
    </div>
  )
}
