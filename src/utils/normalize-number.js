/**
 * A function to return a safe value between two ranges
 * @param {number} numberToNormalize
 * @param {number} minIndex
 * @param {number} maxIndex
 * @returns {number}
 */
export const normalizeNumber = (numberToNormalize, minIndex, maxIndex) => {
	if (numberToNormalize > maxIndex) {
		return maxIndex;
	}

	if (numberToNormalize < minIndex) {
		return minIndex;
	}

	return numberToNormalize;
};
