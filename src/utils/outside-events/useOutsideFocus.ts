import { useOutsideEvent, UseOutsideEventParams } from "./onOutsideEvent";

/**
 * @param {...*} params
 * @param {React.RefObject} params.$0 - An existing ref to use as the parent ref
 * @param {    boolean    } params.$1 - Boolean to enable the event handling
 * @param {    Function   } params.$2 - A function to run if the user focuses outside the parent ref
 */
export const useOutsideFocus = (...params: UseOutsideEventParams) => {
	return useOutsideEvent("focusin", params);
};
