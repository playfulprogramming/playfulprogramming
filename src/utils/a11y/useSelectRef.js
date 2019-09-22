/**
 * This hook is meant to serve as a general utility for single or multi-selects
 */

import { useMemo, useRef, useState } from "react"
import { useOutsideClick, useOutsideFocus } from "../outside-events"
import { genId } from "./getNewId"
import { useKeyboardListNavigation } from "./useKeyboardListNavigation"
import { useUsedKeyboardLast } from "./useUsedKeyboardLast"
import { usePopover } from "./usePopover"

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
 * @param {'single' | 'multi' | false | undefined} enableSelect
 * @param {(i: number) => void} onSel - On an item selection
 * @returns {selectRefRet}
 */
export const useSelectRef = (arrVal, enableSelect, onSel) => {
  // TODO: Change when `arrVal`?
  const [internalArr, setInternalArr] = useState([])
  const [active, setActive] = useState()

  useMemo(() => {
    const newArr = arrVal.map((val, i) => {
      const newVal = {
        id: genId(),
        val,
        index: i,
      }

      if (enableSelect) {
        newVal.selected = false
      }

      return newVal
    })

    setInternalArr(newArr)

    setActive(newArr[0])
  }, [arrVal])

  // This will be empty if `enableSelect` is null
  const selectedArr = useMemo(() =>
      internalArr.filter(item => item.selected),
    [internalArr],
  )

  /**
   * @param {number} index
   * @param {boolean | 'single'} markSelect
   */
  const markAsSelected = (index, markSelect, singleSelection) => {
    // Safely set index
    if (index < 0) {
      index = 0
    } else if (index >= internalArr.length) {
      index = internalArr.length - 1
    }

    setActive(internalArr[index])

    if (markSelect) {
      if (singleSelection) {
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

  const selectAll = () => {
    setInternalArr(internalArr.map(val => {
      val.selected = true
      return val
    }))
  }


  // The parent container
  const parentRef = useRef();

  // The reference to the combobox container div that opens when the expanded is true
  const selectRef = useRef()

  const setExpandedToFalse = () => setExpanded(false);

  /**
   * This ref allows us to compose two circular hooks without having
   * to assume that one already knows of another
   * @type {React.RefObject<Function>}
   */
  const resetLastUsedKeyboardRef = useRef(() => undefined);

  const resetLastUsedKeyboard = resetLastUsedKeyboardRef.current;

  const  { buttonProps, expanded, setExpanded } = usePopover(selectRef, resetLastUsedKeyboard);

  const {
    resetLastUsedKeyboard: tmpEesetUsedKeyboardLast,
    usedKeyboardLast
  } = useUsedKeyboardLast(parentRef, expanded);

  resetLastUsedKeyboardRef.current = tmpEesetUsedKeyboardLast;

  useOutsideClick(parentRef, expanded, setExpandedToFalse);

  useOutsideFocus(parentRef, expanded, setExpandedToFalse);


  // Arrow key handler
  useKeyboardListNavigation(selectRef, internalArr, expanded, (kbEvent, newIndex) => {
    // If arrow keys were handled,
    if (newIndex)  {
      // If shift or shift+ctrl were being handled, mark the items as selected
      const isSelecting = ['Home', "End"].includes(kbEvent.key) ?
        kbEvent.shiftKey && kbEvent.ctrlKey :
        kbEvent.shiftKey;

      if (isSelecting) {
        markAsSelected(newIndex, enableSelect)
        return;
      }

      markAsSelected(newIndex, false);
      return;
    }

    const isSingleSelecting = [" ", "Spacebar"].includes(kbEvent.key);

    if (enableSelect && isSingleSelecting) {
      kbEvent.preventDefault()
      const newIndex = active.index
      markAsSelected(newIndex, 'single')
      return;
    }

    if (!enableSelect && kbEvent.key === "Enter") {
      onSel(active.index)
      return;
    }

    if (enableSelect && kbEvent.code === "KeyA" && kbEvent.ctrlKey) {
        kbEvent.preventDefault()
        selectAll()
        return
    }

    if (kbEvent.key === "Escape") {
      kbEvent.preventDefault()
      setExpandedToFalse()
    }
  })


}
