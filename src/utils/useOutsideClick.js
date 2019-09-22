import { useCallback, useEffect, useRef } from "react"

export const useOutsideClick = (enable, onOutsideClick, parentRef) => {
  const elRef = useRef()
  const handleClickOutside = useCallback(
    e => {
      const currElRef = parentRef || elRef
      if (currElRef.current.contains(e.target)) {
        // inside click
        return
      }
      // outside click
      onOutsideClick()
    },
    [parentRef, elRef]
  )

  useEffect(() => {
    if (enable) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [enable, handleClickOutside])

  return parentRef || elRef
}
