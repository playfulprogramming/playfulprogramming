import React from "react"
import styles from "./style.module.css"
import SearchField from "./search-field"
import FilterListbox from "./filter-listbox"
import WordCount from "./word-count"

class FilterSearchBar extends React.Component {
  render() {
    const { showWordCount = false } = this.props

    const numberOfArticles = 3;
    const wordCount = 4332;
    return (
      <div className={styles.iconContainer}>
        <SearchField/>
        <div className={styles.midContainer}>
        {showWordCount && <WordCount wordCount={wordCount} numberOfArticles={numberOfArticles}/>}
        </div>
        <FilterListbox tags={[
          "Test",
          "Another",
          "One More Makes 3",
          "One More Makes 4",
          "One More Makes 5",
          "One More Makes 1235",
          "One More Makes 55"
        ]}/>
      </div>
    )
  }
}

export default FilterSearchBar
