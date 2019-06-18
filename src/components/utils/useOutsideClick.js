import {useEffect, useRef} from 'react';

export const useOutsideClick = (enable, onOutsideClick, parentRef) => {
  const elRef = parentRef || useRef()
  const handleClickOutside = e => {
    if (elRef.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    onOutsideClick();
  };

  useEffect(() => {
    if (enable) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [enable]);

  return elRef;
}
