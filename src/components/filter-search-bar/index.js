import React from "react"
import searchFilterBarStyles from "./style.module.css"
import SearchField from "./search-field"
import FilterDropdown from "./filter-dropdown"
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
        <FilterDropdown tags={[
          "Test",
          "Another",
        ]}/>
      </div>
    )
  }
}

export default FilterSearchBar
