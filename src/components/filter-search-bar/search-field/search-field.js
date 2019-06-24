import React, { useEffect, useMemo, useState } from "react"
import styles from "./search-field.module.scss"
import classNames from "classnames"
import SearchIcon from "../../../assets/icons/search.svg"
import { useElementBoundingBox } from "../../../utils/useRefBoundingBox"
import posed from "react-pose"
import { useLunr } from "../../../utils/useLunr"

const placeholder = "Search"


const PosedInput = posed.input({
  initial: {
    width: props => props.wiidth,
  },
})

export const SearchField = ({ className, onSearch = () => {} }) => {
  const [inputVal, setInputVal] = useState("")
  const [focused, setFocused] = useState("")

  const {onSearch: searchWithLunr, results} = useLunr();

  useEffect(() => {
    onSearch(results);
  }, [results])

  const { ref: containerRef, width: maxSpanWidth } = useElementBoundingBox()
  const { ref: inputRef, height: inputHeight } = useElementBoundingBox()
  const { ref: spanRef, width: currInputWidth } = useElementBoundingBox(inputVal, a => ({
    ...a,
    width: a.width + 50,
  }))

  /**
   * Class calculation
   */
  const wrapperClasses = useMemo(() => {
    return classNames(styles.btn, {
      [styles.contentBtn]: focused || inputVal,
    })
  }, [
    focused,
    inputVal,
  ])

  const innerWinSize = global.window && window.innerWidth;

  return (
    // 70 as it's the size of all padding/etc more than just the input
    <div className={`${className} ${styles.container}`}>
      <div className={wrapperClasses} onClick={() => inputRef.current.focus()}>
        <SearchIcon className={styles.icon}/>
        <div className={styles.inputContainer} ref={containerRef}>
          <div style={{ height: inputHeight }}/>
          <PosedInput placeholder={placeholder}
                      ref={inputRef}
                      onChange={e => {
                        const val = e.target.value;
                        setInputVal(val)
                        searchWithLunr(val);
                      }}
                      wiidth={innerWinSize >= 450 ? currInputWidth : '100%'}
                      poseKey={`${inputVal || currInputWidth}${innerWinSize}`}
                      pose="initial"
                      value={inputVal}
                      onFocus={() => setFocused(true)}
                      style={{ maxWidth: maxSpanWidth }}
                      onBlur={() => setFocused(false)}
                      className={styles.input}/>
          <span aria-hidden={true} className={styles.input}
                style={{
                  position: "absolute",
                  top: "-300vh",
                }} ref={spanRef}>{inputVal || placeholder}</span>
        </div>
      </div>
    </div>
  )
}
