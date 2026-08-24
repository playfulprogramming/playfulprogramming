import { useEffect, useState } from "preact/hooks";

export function useIsOnClient() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return isClient;
}
