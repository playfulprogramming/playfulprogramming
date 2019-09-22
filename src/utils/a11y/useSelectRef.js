/**
 * This hook is meant to serve as a general utility for single or multi-selects
 */

import { useMemo, useRef, useState } from "react"
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
  /**
   * Because of timing issues within the `runOnSubmit` CB, we need to have
   * an index to add to the tracking index, otherwise pressing spacebar
   * will not update immediately and will wait until this hook re-runs. See
   * the second param for `useSelectableArray` for more info
   * @type {React.RefObject<number>}
   */
  const [manuallyUpdateSelectedArrIndex, setManualUpdateIndex] = useState(0);

  const {
    selectedArr,
    selectAll,
    markAsSelected,
    internalArr
  } = useSelectableArray(arrVal, () => {
    /**
     * Must use a function here as there are timing issues otherwise. Because
     * this can be called from outside of a render, the value will be persistent
     * and only allow us to be able to have a single value. This causes particular
     * problems when dealing with clicking on an item many times
     * @see https://reactjs.org/docs/hooks-reference.html#functional-updates
     */
    setManualUpdateIndex((val) => val + 1);
  });


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
    if (newIndex !== undefined)  {
      // We're selecting using mouse and not holding shift, select only one
      const isMouseEvent = kbEvent.nativeEvent instanceof MouseEvent || kbEvent.nativeEvent instanceof TouchEvent;
      if (isMouseEvent && !kbEvent.shiftKey) {
        markAsSelected(newIndex, newIndex);
        return;
      }

      // If shift or shift+ctrl were being handled, mark the items as selected
      const isKeyboardSelecting = ['Home', "End"].includes(kbEvent.key) ?
          kbEvent.shiftKey && kbEvent.ctrlKey :
          kbEvent.shiftKey;

      // If a single item is selected, go ahead and toggle it
      if (isKeyboardSelecting) {
        markAsSelected(focusedIndex, newIndex)
        return;
      }
    }

    // At this point, we're using mouse to toggle an item, we can stop checking
    // If there are other keys
    if (!kbEvent) return;

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
  }, [focusedIndex, internalArr, manuallyUpdateSelectedArrIndex])


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
