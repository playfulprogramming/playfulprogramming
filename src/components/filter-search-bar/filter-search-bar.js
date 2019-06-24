import React from "react"
import styles from "./filter-search-bar.module.scss"
import { SearchField } from "./search-field"
import { FilterListbox } from "./filter-listbox"
import { WordCount } from "./word-count"

/**
 * @param props
 * @param props.showWordCount
 * @param props.tags
 * @param {(arr: {slug: string}[]) => void} props.onFilter
 * @returns {*}
 * @constructor
 */
export const FilterSearchBar = ({ showWordCount = false, onFilter, numberOfArticles, wordCount, tags }) => {
  return (
    <div className={styles.iconContainer}>
      <SearchField className={styles.searchField}/>
      <div className={styles.midContainer}>
        {showWordCount && <WordCount wordCount={wordCount} numberOfArticles={numberOfArticles}/>}
      </div>
      <FilterListbox className={styles.filterField}
       onFilter={onFilter}
       tags={tags}/>
    </div>
  )
}
