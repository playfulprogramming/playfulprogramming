import React from "react"
import searchFilterBarStyles from "./style.module.css"
import SearchField from "./search-field"
import FilterListbox from "./filter-listbox"
import WordCount from "./word-count"

class FilterSearchBar extends React.Component {
  render() {
    const { showWordCount = false } = this.props

    const numberOfArticles = 3;
    const wordCount = 4332;
    return (
      <div className={searchFilterBarStyles.iconContainer}>
        <SearchField/>
        {showWordCount ? <WordCount wordCount={wordCount} numberOfArticles={numberOfArticles}/> : <div/>}
        <FilterListbox tags={[
          "Test",
          "Another",
          "One More Makes 3"
        ]}/>
      </div>
    )
  }
}

export default FilterSearchBar
