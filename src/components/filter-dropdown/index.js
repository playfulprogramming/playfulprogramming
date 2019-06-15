import React from "react"
import filterStyles from "./style.module.css"
import FilterIcon from "../../assets/icons/filter.svg"

const FilterDropdown = () => {
  return (
    <div className={filterStyles.container}>
      <FilterIcon/>
    </div>
  )
}

export default FilterDropdown
