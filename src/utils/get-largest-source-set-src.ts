/**
 * In order of opperations:
 * - Prefer SVG
 * - Prefer PNG or JPG (for maximum support)
 * - Prefer WebP
 *
 * Then:
 * - Prefer SVG
 * - Prefer largest `w` value
 * - Prefer largest multiplier (`2x` and `2.0x` supported)
 *
 * @examples
 * "images/team-photo.jpg 1x, images/team-photo-retina.jpg 2x, images/team-photo-full.jpg 2048w"
 * "header640.png 640w, header960.png 960w, header1024.png 1024w, header.png"
 * "icon32px.png 32w, icon64px.png 64w, icon-retina.png 2x, icon-ultra.png 3x, icon.svg"
 */
const sizeStringRegex = / ([0-9.]+)([xw])$/;

const parseSourceString = (source: string) => {
	const [fullMatch, sizeStr, sizeType] = sizeStringRegex.exec(
		source,
	) as string[];
	const srcStr = source.replace(fullMatch, "");
	return {
		src: srcStr,
		size: Number(sizeStr),
		sizeType,
	};
};

type SourceType = ReturnType<typeof parseSourceString>;

export const getLargestSourceSetSrc = (sourceSet: string) => {
	const pictureSources = sourceSet.split(",");

	let largest!: SourceType;
	for (const pictureSource of pictureSources) {
		const parsedSource = parseSourceString(pictureSource);
		// Nothing is better quality than an SVG, we win.
		if (parsedSource.src.endsWith(".svg")) return parsedSource;
		if (!largest) {
			largest = parsedSource;
			continue;
		}
		// Prefer `w` over `x`, since we don't know the browser size on the server
		if (largest.sizeType === "w" && parsedSource.sizeType === "x") continue;
		if (largest.sizeType === "x" && parsedSource.sizeType === "w") {
			largest = parsedSource;
			continue;
		}
		if (largest.size < parsedSource.size) {
			largest = parsedSource;
			continue;
		}
		if (largest.size === parsedSource.size) {
			if (
				largest.src.endsWith(".webp") &&
				(parsedSource.src.endsWith(".png") ||
					parsedSource.src.endsWith(".jpg") ||
					parsedSource.src.endsWith(".jpeg"))
			) {
				largest = parsedSource;
				continue;
			}
		}
	}
	return largest;
};
