import { useCallback, useEffect, useRef } from "react";

export const useOutsideClick = (enable, onOutsideClick, parentRef) => {
	const localElRef = useRef();
	const elRef = parentRef || localElRef;
	const handleClickOutside = useCallback(
		e => {
			if (elRef.current.contains(e.target)) {
				// inside click
				return;
			}
			// outside click
			onOutsideClick();
		},
		[elRef, onOutsideClick]
	);

	useEffect(() => {
		if (enable) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [enable, handleClickOutside]);

	return parentRef || elRef;
};
