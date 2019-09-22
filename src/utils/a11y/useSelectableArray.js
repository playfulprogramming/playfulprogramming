import { useCallback, useEffect, useMemo, useRef } from "react"
import { genId } from "./getNewId"
import { normalizeNumber } from "../normalize-number"

const getNewArr = (valArr) => {
  return valArr.map((val, i) => {
    return {
        id: genId(),
        val,
        index: i,
        selected: false
      };
    }
  );
}

export const useSelectableArray = (valArr) => {
  /**
   * Using a `useRef` here for performance. Otherwise, to keep immutability
   * there's all kinds of hacks that must be implemented
   */
  const internalArrRef = useRef(getNewArr(valArr));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    internalArrRef.current = getNewArr(valArr);
  }, [valArr])

  const currInternalArr = internalArrRef && internalArrRef.current;

  // This will be empty if `enableSelect` is null
  const selectedArr = useMemo(() =>
      currInternalArr.filter(item => item.selected),
    [currInternalArr],
  )

  const markAsSelected = useCallback((fromIndex, toIndex) => {
    const maxIndex = currInternalArr.length - 1;

    const newFromIndex = normalizeNumber(fromIndex, 0, maxIndex);
    const newToIndex = normalizeNumber(toIndex, 0, maxIndex);

    // Handle single selection properly
    if (newToIndex === newFromIndex && fromIndex === toIndex) {
      currInternalArr[toIndex].selected = !currInternalArr[toIndex].selected;
      return
    }

    const smallerNum = newFromIndex > newToIndex ? newToIndex : newFromIndex;
    const biggerNum = newFromIndex > newToIndex ?  newFromIndex : newToIndex;

    for (let i = smallerNum; i <= biggerNum; i++) {
      currInternalArr[i].selected = true;
    }
  }, [currInternalArr])

  const selectAll = () => {
    internalArrRef.current.forEach(val => {
      val.selected = true
    })
  }

  return {
    selectedArr,
    selectAll,
    markAsSelected,
    internalArr: internalArrRef.current
  }
}
