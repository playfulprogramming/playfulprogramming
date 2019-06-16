import React, { useState, useMemo } from "react"
import btnWrapperStyles from "./style.module.css"
import classNames from "classnames"
import SearchIcon from "../../../assets/icons/search.svg"

const SearchField = () => {
  const [inputVal, setInputVal] = useState("")
  const [focused, setFocused] = useState("")

  const wrapperClasses = useMemo(() => {
    return classNames(btnWrapperStyles.btn, {
      [btnWrapperStyles.contentBtn]: focused || inputVal,
    })
  }, [
    focused,
    inputVal,
  ])

  return (
    <div className={wrapperClasses}>
      <SearchIcon className={btnWrapperStyles.icon}/>
      <div className={btnWrapperStyles.inputContainer}>
        <input placeholder="Search"
               onChange={e => setInputVal(e.target.value)}
               value={inputVal}
               onFocus={() => setFocused(true)}
               onBlur={() => setFocused(false)}
               className={btnWrapperStyles.input}/>
      </div>
    </div>
  )
}

export default SearchField
