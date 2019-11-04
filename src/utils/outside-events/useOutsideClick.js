import { useOutsideEvent } from "./onOutsideEvent";

/**
 * @param {...*} params
 * @param {React.RefObject} params.$0 - An existing ref to use as the parent ref
 * @param {    boolean    } params.$1 - Boolean to enable the event handling
 * @param {    Function   } params.$2 - A function to run if the user clicks outside the parent ref
 */
export const useOutsideClick = (...params) => {
	return useOutsideEvent("mousedown", params);
};
