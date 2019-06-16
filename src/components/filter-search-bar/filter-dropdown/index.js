import React, { useState } from "react"
import filterStyles from "./style.module.css"
import FilterIcon from "../../../assets/icons/filter.svg"
import { Multiselect } from 'react-widgets'

const TagItem = ({ item }) => (
  <span>
    <strong>{item}</strong>
  </span>
);

const ListItem = ({ item }) => (
  <span>
    <strong>{item}</strong>
  </span>
);


const FilterDropdown = ({tags = []}) => {
  const [filters, setFilters] = useState([])
  return (
    <div className={filterStyles.container}>
      <FilterIcon className={filterStyles.icon}/>
      <Multiselect
        data={tags}
        tagComponent={TagItem}
        placeholder="Filter"
        value={filters}
        onChange={tags => setFilters(tags)}
        // listComponent={}
        itemComponent={ListItem}
      />
    </div>
  )
}

export default FilterDropdown
