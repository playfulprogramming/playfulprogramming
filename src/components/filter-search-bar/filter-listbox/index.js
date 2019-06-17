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
import React, { useMemo } from "react"
import filterStyles from "./style.module.css"
import FilterIcon from "../../../assets/icons/filter.svg"
import { useSelectRef } from "../../a11y-utils/useSelectRef"
import classNames from "classnames"

const FilterListbox = ({ tags = [] }) => {

  const { ref: listBoxRef, active, values, selected, selectIndex, expanded, setExpanded } = useSelectRef(tags)

  const appliedTagsStr = useMemo(() => {
    if (!selected.length) return "Filters"
    return selected.map(v => v.val).join(", ")
  }, [selected])

  return (
    <>
      <div>
        <span id="exp_elem">
          Choose a tag to filter by:
        </span>
        <button
          onClick={() => {
            setExpanded(true)
            listBoxRef.current.focus()
          }}
          aria-haspopup="listbox"
          aria-labelledby="exp_elem filter-button"
          id="filter-button"
        >
          <FilterIcon className={filterStyles.icon}
                      aria-hidden={true}/>
          {appliedTagsStr}
        </button>
        <ul id="listBoxID"
            role="listbox"
            ref={listBoxRef}
            style={{ opacity: expanded ? 1 : 0 }}
            aria-labelledby="exp_elem"
            tabIndex={-1}
            aria-multiselectable="true"
            aria-activedescendant={active && active.id}>
          {values.map((tag, i) => {
            const liClassName = classNames(filterStyles.option, {
              [filterStyles.active]: active.index === i,
              [filterStyles.selected]: tag.selected,
            })
            return (
              <li className={liClassName}
                  role="option"
                  key={tag.id}
                  onClick={e => selectIndex(i, e)}
                  id={tag.id}
                  aria-selected={tag.selected}>
                {tag.val}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default FilterListbox
