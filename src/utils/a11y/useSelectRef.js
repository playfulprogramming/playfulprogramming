/**
 * This hook is meant to serve as a general utility for single or multi-selects
 */

import { useMemo, useRef } from "react"
import { useKeyboardListNavigation } from "./useKeyboardListNavigation"
import { useUsedKeyboardLast } from "./useUsedKeyboardLast"
import { usePopover } from "./usePopover"
import { useSelectableArray } from "./useSelectableArray"

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
 * @param {(i: number) => void} onSel - On an item selection
 * @returns {selectRefRet}
 */
export const useSelectRef = (arrVal, enableSelect, onSel) => {
  const {
    selectedArr,
    selectAll,
    markAsSelected,
    internalArr
  } = useSelectableArray(arrVal);

  // The parent container
  const parentRef = useRef();

  // The reference to the combobox container div that opens when the expanded is true
  const selectRef = useRef()

  /**
   * This ref allows us to compose two circular hooks without having
   * to assume that one already knows of another
   * @type {React.RefObject<Function>}
   */
  const resetLastUsedKeyboardRef = useRef(() => undefined);

  const resetLastUsedKeyboard = resetLastUsedKeyboardRef.current;

  const  { buttonProps, expanded, setExpanded } = usePopover(selectRef, resetLastUsedKeyboard);

  const {
    resetLastUsedKeyboard: tmpResetUsedKeyboardLast,
    usedKeyboardLast
  } = useUsedKeyboardLast(parentRef, expanded);

  resetLastUsedKeyboardRef.current = tmpResetUsedKeyboardLast;

  // Arrow key handler
  const {
    focusedIndex,
    selectIndex
  } = useKeyboardListNavigation(selectRef, internalArr, expanded, (kbEvent, focusedIndex, newIndex) => {
    // If arrow keys were handled,
    if (newIndex)  {
      // If shift or shift+ctrl were being handled, mark the items as selected
      const isSelecting = ['Home', "End"].includes(kbEvent.key) ?
        kbEvent.shiftKey && kbEvent.ctrlKey :
        kbEvent.shiftKey;

      console.log(isSelecting);

      if (isSelecting) {
        markAsSelected(focusedIndex, newIndex)
        return;
      }
    }

    const isSingleSelecting = [" ", "Spacebar"].includes(kbEvent.key);

    if (enableSelect && isSingleSelecting) {
      kbEvent.preventDefault()
      const newIndex = active.index
      markAsSelected(newIndex, newIndex)
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
      setExpanded(false)
    }
  })

  const active = useMemo(() => {
    return internalArr[focusedIndex];
  }, [focusedIndex, internalArr])


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
    buttonProps
  }
}
