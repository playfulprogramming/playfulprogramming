/**
 * A function to return a safe value between two ranges
 */
export const normalizeNumber = (numberToNormalize: number, minIndex: number, maxIndex: number) => {
	if (numberToNormalize > maxIndex) {
		return maxIndex;
	}

	if (numberToNormalize < minIndex) {
		return minIndex;
	}

	return numberToNormalize;
};
