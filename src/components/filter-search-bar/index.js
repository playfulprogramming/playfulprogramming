import React from "react"
import FilterIcon from "../../assets/icons/filter.svg"
import filterStyles from "./style.module.css"
import SearchField from "../search-field"
import FilterDropdown from "../filter-dropdown"

class FilterSearchBar extends React.Component {
  render() {
    const { showWordCount = false } = this.props

    return (
      <div className={filterStyles.iconContainer}>
          <SearchField/>
        <div className={'a'}>
        </div>
        <FilterDropdown/>
      </div>
    )
  }
}

export default FilterSearchBar
