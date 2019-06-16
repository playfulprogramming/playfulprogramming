import React, { useState } from "react"
import filterStyles from "./style.module.css"
import FilterIcon from "../../../assets/icons/filter.svg"

const FilterDropdown = ({tags = []}) => {
  const [filters, setFilters] = useState([])
  return (
    <div className={filterStyles.container}>
      <FilterIcon className={filterStyles.icon}/>
    </div>
  )
}

export default FilterDropdown
