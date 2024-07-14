// Evenly dispurse the number of items across a semi-circle going downward from the base of a DIV
// Calculate the positions in percentages we need to place each item
export function calculatePosition(
	numberOfItems: number,
	index: number,
	offset = 0,
) {
	const angle = ((Math.PI * 2) / numberOfItems) * index + offset;
	const x = Math.cos(angle) * 50 + 50; // Adjusted for horizontal positioning
	const y = Math.sin(angle) * 50 + 50; // Adjusted for vertical positioning

	const scale = 1 - (Math.abs(Math.cos(angle)) * 0.5 + 0.5);

	return { x, y, scale };
}

export function getInitialItems(numberOfItems: number) {
	return Array.from({ length: numberOfItems }).map((_, index) => {
		const { x, y, scale } = calculatePosition(numberOfItems, index);
		return { x: `${x}%`, y: `${y}%`, scale };
	});
}
