// Evenly dispurse the number of items across a circle going downward from the base of a DIV
// Calculate the positions in pixels we need to place each item
export function calculatePosition(
	index: number,
	numberOfItems: number,
	// Can exceed 360 degrees and go lower than 0
	rotation: number,
	containerWidth: number,
) {
	// The calculation is based on the container's width and height, x and y should be pixels
	const radius = containerWidth / 2;
	const angle = (rotation * Math.PI) / 180;
	const angleStep = 360 / numberOfItems;
	const itemAngle = angleStep * index;
	const x = radius + radius * Math.cos((angle + itemAngle) * (Math.PI / 180));
	const y = radius + radius * Math.sin((angle + itemAngle) * (Math.PI / 180));

	const angleDegrees = (angle + itemAngle) % 360;

	let scale;
	// Determine scale based on angle range
	if (angleDegrees >= 10 && angleDegrees <= 170) {
		scale = 1; // No scaling for items within this range
	} else if (angleDegrees > 170 && angleDegrees <= 180) {
		// Scale down linearly from 120 to 150 degrees to 0
		scale = ((angleDegrees - 180) / (170 - 180)) * (1 - 0) + 0;
	} else if (angleDegrees >= 0 && angleDegrees <= 10) {
		// Scale down linearly from 30 to 60 degrees to 0
		scale = ((angleDegrees - 0) / (10 - 0)) * (1 - 0) + 0;
	} else {
		scale = 0;
	}

	if (scale < 0.7) {
		scale = 0;
	}

	return { x, y, scale };
}

export function getInitialItems(numberOfItems: number) {
	return Array.from({ length: numberOfItems });
}
