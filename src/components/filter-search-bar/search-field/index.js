import React, { useState, useMemo } from "react"
import btnWrapperStyles from "./style.module.css"
import classNames from "classnames"
import SearchIcon from "../../../assets/icons/search.svg"
import { useElementBoundingBox } from "../../utils/useRefBoundingBox"

const placeholder = "Search";

const SearchField = () => {
  const [inputVal, setInputVal] = useState("")
  const [focused, setFocused] = useState("")

  const {ref: containerRef, width: maxSpanWidth} = useElementBoundingBox();
  const {ref: spanRef, width: currInputWidth} = useElementBoundingBox();

  /**
   * Class calculation
   */
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
      <div className={btnWrapperStyles.inputContainer} ref={containerRef}>
        <input placeholder={placeholder}
               onChange={e => setInputVal(e.target.value)}
               value={inputVal}
               onFocus={() => setFocused(true)}
               onBlur={() => setFocused(false)}
               className={btnWrapperStyles.input}/>
               <span aria-hidden={true} style={{position: 'absolute', top: '-300vh'}} ref={spanRef}>{inputVal || placeholder}</span>
      </div>
    </div>
  )
}

export default SearchField
