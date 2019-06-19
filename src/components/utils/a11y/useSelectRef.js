/**
 * I need to cleanup this code and also add:
 *
 */
import { useMemo, useState, useRef, useEffect } from "react"
import { useOutsideClick } from "../useOutsideClick"

// Make new export in @reach-ui/auto-id
let id = 0
const genId = () => ++id

/**
 * @callback selectIndexCB
 * @prop {number} index - The index to toggle the selected state of
 * @prop {MouseEvent|KeyboardEvent} event - The event to see if `select` is highlighted
 */

/**
 * @typedef {any} selectRefRetValue
 */

/**
 * @typedef {object} selectRefRet
 * @prop {selectRefRetValue} active - The currently highlighted item
 * @prop {selectRefRetValue[]} selected - The array of selected items
 * @prop {any} ref - The reference to the element to apply to the div
 * @prop {selectIndexCB} selectIndex - A toggle for that index
 * @prop {selectRefRetValue[]} values - The array of values
 */

/**
 * @param arrVal
 * @returns {selectRefRet}
 */
export const useSelectRef = (arrVal) => {
  // TODO: Change when `arrVal`?
  const [internalArr, setInternalArr] = useState([])
  const [active, setActive] = useState()
  const [usedKeyboardLast, setUsedKeyboardLast] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useMemo(() => {
    const newArr = arrVal.map((val, i) => ({
      id: genId(),
      selected: false,
      val,
      index: i,
    }))

    setInternalArr(newArr)

    setActive(newArr[0])
  }, [arrVal])

  const selectedArr = useMemo(() =>
      internalArr.filter(item => item.selected),
    [internalArr],
  )

  const markAsSelected = (index, markSelect) => {
    // Safely set index
    if (index < 0) {
      index = 0
    } else if (index >= internalArr.length) {
      index = internalArr.length - 1
    }

    setActive(internalArr[index])

    if (markSelect) {
      if (markSelect === "single") {
        const newArr = [...internalArr]
        newArr[index].selected = !newArr[index].selected
        setInternalArr(newArr)
        return
      }

      /**
       *
       * @param i - The index being passed to compare whether to mark as selected or not
       * @returns {boolean} - Should be selected?
       */
      let compareFunc = (i) => i === index

      // New index is before, we want to save all items before or equal
      if (index < active.index) {
        compareFunc = (i) => i <= active.index && i >= index
      } else {
        compareFunc = (i) => i >= active.index && i <= index
      }

      // Set the internal array with a new array with right items selected
      setInternalArr(
        internalArr.map((val, i) => {
          if (compareFunc(i)) {
            val.selected = true
          }
          return val
        }),
      )
    }
  }

  const selectIndex = (i, e, type) => {
    if (type === "click" || (e && e.type === "click")) {
      // HACK: Is mouse event?
      setUsedKeyboardLast(false)
    }
    markAsSelected(i, (e && e.shiftKey) || "single")
  }

  const selectAll = () => {
    setInternalArr(internalArr.map(val => {
      val.selected = true
      return val
    }))
  }

  const selectRef = useRef()

  // Arrow key handler
  useEffect(() => {
    if (selectRef.current) {

      const onKeyDown = event => {
        if (!expanded) {
          return
        }
        let _newIndex
        let isSelecting
        if (event.key === "ArrowDown") {
          event.preventDefault()
          _newIndex = active.index + 1
          isSelecting = event.shiftKey
        } else if (event.key === "ArrowUp") {
          event.preventDefault()
          _newIndex = active.index - 1
          isSelecting = event.shiftKey
        } else if (event.key === " " || event.key === "Spacebar") {
          event.preventDefault()
          _newIndex = active.index
          isSelecting = "single"
        } else if (event.key === "Home") {
          event.preventDefault()
          _newIndex = 0
          isSelecting = event.shiftKey && event.ctrlKey
        } else if (event.key === "End") {
          event.preventDefault()
          _newIndex = internalArr.length - 1
          isSelecting = event.shiftKey && event.ctrlKey
        } else {
          if (event.code === "KeyA" && event.ctrlKey) {
            event.preventDefault()
            selectAll()
            setUsedKeyboardLast(true)
            return
          } else if (event.key === "Escape") {
            event.preventDefault()
            setUsedKeyboardLast(true)
            setExpanded(false)
            return
          } else {
            return
          }
        }

        setUsedKeyboardLast(true)
        markAsSelected(_newIndex, isSelecting)
      }

      const el = selectRef.current
      el.addEventListener("keydown", onKeyDown)
      return () => el.removeEventListener("keydown", onKeyDown)
    }
    // `active` must be here as otherwise this event listener never updates
  }, [
    selectRef,
    active,
    expanded,
    usedKeyboardLast,
  ])

  useEffect(() => {
    if (selectRef && expanded) {
      selectRef.current.focus()
    }
  }, [
    expanded,
    selectRef,
  ])

  const parentRef = useOutsideClick(expanded, () => setExpanded(false))

  const buttonProps = useMemo(() => ({
    onClick: () => {
      setExpanded(!expanded)
      setUsedKeyboardLast(false)
    },
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setUsedKeyboardLast(true)
        setExpanded(!expanded)
      }
    },
  }), [
    selectRef,
    expanded,
    usedKeyboardLast,
  ])


  return {
    selected: selectedArr,
    active,
    ref: selectRef,
    parentRef,
    values: internalArr,
    selectIndex,
    expanded,
    setExpanded,
    usedKeyboardLast,
    buttonProps,
  }
}
