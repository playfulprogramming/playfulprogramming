import React, { useState, useMemo } from "react"
import btnWrapperStyles from "./style.module.css"
import classNames from "classnames"
import SearchIcon from "../../../assets/icons/search.svg"
import { useElementBoundingBox } from "../../utils/useRefBoundingBox"
import posed from "react-pose"

const placeholder = "Search";


const PosedInput = posed.input({
  initial: {
    width: props => props.wiidth
  },
})

const SearchField = () => {
  const [inputVal, setInputVal] = useState("")
  const [focused, setFocused] = useState("")

  const {ref: containerRef, width: maxSpanWidth} = useElementBoundingBox();
  const {ref: inputRef, height: inputHeight} = useElementBoundingBox();
  const {ref: spanRef, width: currInputWidth} = useElementBoundingBox(inputVal, a => ({...a, width: a.width + 50}));

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
    <div className={wrapperClasses} onClick={() => inputRef.current.focus()}>
      <SearchIcon className={btnWrapperStyles.icon}/>
      <div className={btnWrapperStyles.inputContainer} ref={containerRef}>
        <div style={{height: inputHeight}}/>
        <PosedInput placeholder={placeholder}
               ref={inputRef}
               onChange={e => {
                 console.log('onchange')
                 setInputVal(e.target.value)
               }}
               wiidth={currInputWidth}
                    poseKey={inputVal || currInputWidth}
                    pose="initial"
               value={inputVal}
               onFocus={() => setFocused(true)}
               style={{maxWidth: maxSpanWidth}}
               onBlur={() => setFocused(false)}
               className={btnWrapperStyles.input}/>
               <span aria-hidden={true} className={btnWrapperStyles.input}
                     style={{position: 'absolute', top: '-300vh'}} ref={spanRef}>{inputVal || placeholder}</span>
      </div>
    </div>
  )
}

export default SearchField
