import { useMemo, useRef } from "react"
import { useAfterInit } from "./useAfterInit"
import { useWindowSize } from "./useWindowSize"

const emptyVal = {
  x: 0,
  y: 0,
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
}

export const useElementBoundingBox = (ms = 150) => {
  // Get the initial element size
  const afterInit = useAfterInit()
  const windowSize = useWindowSize(ms)
  const ref = useRef()

  const boundingObj = useMemo(() => {
    if (!ref.current) return {
      ...emptyVal,
      ref,
    }
    const bounding = ref.current.getBoundingClientRect()
    return {
      ref,
      ...bounding,
    }
  }, [
    ref,
    afterInit,
    windowSize,
  ])

  return boundingObj
}
