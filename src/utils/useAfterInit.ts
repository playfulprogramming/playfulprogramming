import { useEffect, useState } from "react";

export const useAfterInit = () => {
	const [afterInit, setAfterInit] = useState(false);
	useEffect(() => setAfterInit(true), []);
	return afterInit;
};
