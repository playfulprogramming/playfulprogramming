/**
 * This is a hand-spun component to match the guidelines for a listbox ALA w3 guidelines
 * @see https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
 *
 * ✅ Escape - Collapse the dropdown
 * ✅ Up - Focus previous item
 * ✅ Down - Focus next item
 * ✅ Home - Goes to first item
 * ✅ End - Goes to last item
 * ✅ Space - Toggles selection of item
 * ✅ Shift + Down - Focuses and selects next item
 * ✅ Shift + Up - Focuses and selects previous item
 * ✅ Ctrl + Shift + Home - Selects from the focused option to start of list
 * ✅ Ctrl + Shift + End - Selects from the focused option to end of list
 * ✅ Ctrl + A - Toggles selection of all
 * 🔲 Click outside this component to close
 * Am I supposed to focus lock w/ tab?
 * 🔲 If so, add that
 * 🔲 If not, close on `blur`
 */

/**
 * "Filters"
 * Click to expand
 * Clicking filters won't do anything
 * After not expanded, show the filters by animating away "filters"
 * If nothing is selected, don't animate away "Filters"
 */

import React, { useEffect, useMemo, useRef, useState } from "react"
import filterStyles from "./style.module.css"
import FilterIcon from "../../../assets/icons/filter.svg"
import FilterExpandedIcon from "../../../assets/icons/filter_expanded.svg"
import { useSelectRef } from "../../utils/a11y/useSelectRef"
import classNames from "classnames"

import posed from "react-pose"

const FilterListItem = ({ tag, index, active, expanded, selectIndex }) => {
  const liClassName = classNames(filterStyles.option, {
    [filterStyles.active]: active.index === index,
    [filterStyles.selected]: tag.selected,
  })
  return (
    <li className={liClassName}
        role="option"
        key={tag.id}
        onClick={e => expanded && selectIndex(index, e)}
        id={tag.id}
        aria-selected={tag.selected}>
      <span>{tag.val}</span>
    </li>
  )
}

const FilterDisplaySpan = posed.span({
  initial: {
    width: props => {
      console.log("width", props)
      return (props.wiidth || 0)
    },
    height: props => props.heiight,
  },
})

const FilterListbox = ({ tags = [] }) => {
  const { ref: listBoxRef, active, values, selected, selectIndex, expanded, setExpanded, parentRef } = useSelectRef(tags)
  const shouldShowFilterMsg = expanded || !selected.length
  const [afterInit, setAfterInit] = useState(false);

  const filterTextRef = useRef()
  const filterTextClasses = classNames({
    [filterStyles.show]: shouldShowFilterMsg,
    [filterStyles.placeholder]: true,
  })
  const appliedStrClasses = classNames({
    [filterStyles.show]: !shouldShowFilterMsg,
    [filterStyles.appliedTags]: true,
  })

  const appliedFiltersTextRef = useRef()

  const currentWidth = useMemo(() => {
    if (!filterTextRef.current || !filterTextRef.current) return 0
    if (shouldShowFilterMsg) {
      const filtTxtBound = filterTextRef.current.getBoundingClientRect()
      let toReturn = filtTxtBound.width
      if (expanded) {
        toReturn += 100
      }
      return toReturn
    }

    const appliedFiltBound = appliedFiltersTextRef.current.getBoundingClientRect()
    return appliedFiltBound.width
  }, [
    expanded,
    (shouldShowFilterMsg && shouldShowFilterMsg.current),
    (appliedFiltersTextRef && appliedFiltersTextRef.current),
    filterTextRef,
    afterInit
  ])

  useEffect(() => setAfterInit(true), [])

  const currentHeight = useMemo(() => {
    if (!filterTextRef.current || !filterTextRef.current) return 0
    const filtTxtBound = filterTextRef.current.getBoundingClientRect()
    const appliedFiltBound = appliedFiltersTextRef.current.getBoundingClientRect()
    return filtTxtBound.height < appliedFiltBound.height ? appliedFiltBound.height : filtTxtBound.height
  }, [
    appliedFiltersTextRef,
    filterTextRef,
  ])

  const appliedTagsStr = useMemo(() => {
    if (!selected.length) return ""
    return selected.map(v => v.val).join(", ")
  }, [selected])

  const containerClassName = useMemo(() => {
    return classNames(filterStyles.container, {
      [filterStyles.expanded]: expanded,
    })
  }, [expanded])

  return (
    <div className={containerClassName}>
      <div className={filterStyles.buttonContainer} ref={parentRef}>
        <span id="exp_elem" className="visually-hidden">
          Choose a tag to filter by:
        </span>
        <button
          className={classNames(filterStyles.filterButton, {
            hasTags: !!selected.length,
          })}
          onClick={() => {
            setExpanded(!expanded)
            if (expanded) {
              listBoxRef.current.focus()
            }
          }}
          aria-haspopup="listbox"
          aria-labelledby="exp_elem filter-button"
          id="filter-button"
        >
          {expanded ?
            <FilterExpandedIcon className={filterStyles.icon}
                                aria-hidden={true}/>
            :
            <FilterIcon className={filterStyles.icon}
                        aria-hidden={true}/>
          }
          <FilterDisplaySpan className={filterStyles.textContainer}
                             heiight={currentHeight}
                             pose="initial"
                             poseKey={currentWidth}
                             wiidth={currentWidth}>
           <span
             ref={filterTextRef}
             aria-hidden={true}
             className={filterTextClasses}
           >
             Filters
           </span>
            <span
              ref={appliedFiltersTextRef}
              className={appliedStrClasses}
            >
              {appliedTagsStr}
            </span>
          </FilterDisplaySpan>
        </button>
        <ul id="listBoxID"
            role="listbox"
            ref={listBoxRef}
            className={classNames(filterStyles.listbox, { "visually-hidden": !expanded })}
            aria-labelledby="exp_elem"
            tabIndex={-1}
            aria-multiselectable="true"
            aria-activedescendant={active && active.id}
        >
          {
            values.map((tag, index) => (
              <FilterListItem
                tag={tag}
                index={index}
                expanded={expanded}
                selectIndex={selectIndex}
                active={active}
              />
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default FilterListbox
