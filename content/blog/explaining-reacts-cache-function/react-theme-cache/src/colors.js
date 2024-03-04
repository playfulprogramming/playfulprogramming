function hexToRgb(hex) {
	// Remove the hash character
	hex = hex.replace(/^#/, "");

	// Parse the hex value into separate R, G, B values
	const bigint = parseInt(hex, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return { r, g, b };
}

function rgbToHex(r, g, b) {
	// Convert RGB values to a hex color code
	return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export function generateComplimentaryColors(hexColor) {
	const baseColor = hexToRgb(hexColor);

	// Calculate the complementary color by inverting each RGB component
	const complimentary1 = rgbToHex(
		255 - baseColor.r,
		255 - baseColor.g,
		255 - baseColor.b,
	);

	// Optionally, you can adjust the following multipliers for different shades
	const multiplier = 0.8;
	const complimentary3 = rgbToHex(
		Math.floor(baseColor.r * (1 + multiplier)),
		Math.floor(baseColor.g * (1 + multiplier)),
		Math.floor(baseColor.b * (1 + multiplier)),
	);

	return [complimentary1, complimentary3];
}

export const getReadableColor = (hexcolor) => {
	const r = parseInt(hexcolor.substr(1, 2), 16);
	const g = parseInt(hexcolor.substr(3, 2), 16);
	const b = parseInt(hexcolor.substr(5, 2), 16);
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? "#000000" : "#ffffff";
};
