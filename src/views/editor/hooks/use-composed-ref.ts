import type { RefObject } from "preact";
import { useCallback, useRef } from "preact/hooks";

// basically Exclude<Preact.ClassAttributes<T>["ref"], string>
type UserRef<T> =
	| ((instance: T | null) => void)
	| RefObject<T | null>
	| null
	| undefined;

const updateRef = <T>(ref: NonNullable<UserRef<T>>, value: T | null) => {
	if (typeof ref === "function") {
		ref(value);
	} else if (ref && typeof ref === "object" && "current" in ref) {
		// Safe assignment without MutableRefObject
		(ref as { current: T | null }).current = value;
	}
};

export const useComposedRef = <T extends HTMLElement>(
	libRef: RefObject<T | null>,
	userRef: UserRef<T>,
) => {
	const prevUserRef = useRef<UserRef<T>>(null);

	return useCallback(
		(instance: T | null) => {
			if (libRef && "current" in libRef) {
				(libRef as { current: T | null }).current = instance;
			}

			if (prevUserRef.current) {
				updateRef(prevUserRef.current, null);
			}

			prevUserRef.current = userRef;

			if (userRef) {
				updateRef(userRef, instance);
			}
		},
		[libRef, userRef],
	);
};

export default useComposedRef;
