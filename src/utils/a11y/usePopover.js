/**
 * This hook is meant to provide a utility that can be used to compose functionality
 * for a popover component. This includes the `expanded` property handling as well
 * as the props to be added to the trigger button
 *
 * ✅ Have an open and closed state handlers
 * ✅ Close on escape key
 * ✅ Close on click outside
 * ✅ Focus on popover area upon opening
 * 🐛 Doesn't seem to close on focus loss
 *       Needs an optional prop (?)
 */
import { useCallback, useEffect, useMemo, useState } from "react"
import { useOutsideClick, useOutsideFocus } from "../outside-events"

/**
 * @param {React.RefObject} popoverAreaRef - The div that will be used as the popover area to focus on when the popover is opened
 * @param {React.MouseEventHandler} [onBtnClick] - An add-on CB function to the button event handler
 * @param {React.KeyboardEventHandler} [onBtnKeyDown] - An add-on CB function to the button event handler
 * @returns {{buttonProps, expanded}}
 */
export const usePopover = (popoverAreaRef, onBtnClick, onBtnKeyDown) => {
  const [expanded, setExpanded] = useState(false);

  const buttonProps = useMemo(() => ({
    onClick: (e) => {
      setExpanded(!expanded)
      if (onBtnClick) {
        e.persist && e.persist();
        onBtnClick(e);
      }
    },
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setExpanded(!expanded)
      }
      if (onBtnKeyDown) {
        e.persist && e.persist();
        onBtnKeyDown(e);
      }
    },
  }), [
    expanded,
    onBtnClick,
    onBtnKeyDown
  ])

  const currentBtnRef = popoverAreaRef && popoverAreaRef.current;

  // Focus the select ref whenever an item is expanded
  useEffect(() => {
    if (currentBtnRef && expanded) {
      currentBtnRef.focus()
    }
  }, [
    expanded,
    currentBtnRef
  ])

  const setExpandedToFalse = useCallback(() => setExpanded(false), []);

  useOutsideClick(popoverAreaRef, expanded, setExpandedToFalse);

  useOutsideFocus(popoverAreaRef, expanded, setExpandedToFalse);

  return {
    buttonProps,
    expanded,
    setExpanded
  }
}
