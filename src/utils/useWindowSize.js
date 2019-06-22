/**
 * Code migrated from this PR to use ES6 imports:
 * @see https://github.com/rehooks/window-size/pull/4
 */
import { useEffect, useState } from "react"

function getSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  }
}

export const useWindowSize = debounceMs => {
  let [windowSize, setWindowSize] = useState(getSize())

  let timeoutId

  function handleResize() {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(function() {
      setWindowSize(getSize())
    }, debounceMs)
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return windowSize
}
