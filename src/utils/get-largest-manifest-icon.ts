export interface Manifest {
	name: string;
	short_name: string;
	theme_color: string;
	background_color: string;
	icons:
		| Array<{
				src: string;
				// "72x72"
				// "145x145 192x192 512x512"
				sizes: string;
				// "image/png"
				type: string;
				// "48": "icon.png"
		  }>
		| Record<string, string>;
}

const parseManifestIconSrcString = (str: string) => {
	const iconSizes = str.split(" ");
	return iconSizes.map((iconSizeStr) => {
		if (!Number.isNaN(Number(iconSizeStr))) return Number(iconSizeStr);
		const splitNumber = Number(iconSizeStr.split("x")[0]);
		if (!Number.isNaN(splitNumber)) return splitNumber;
		return -Infinity;
	});
};

export const getLargestManifestIcon = (manifest: Manifest) => {
	if (!manifest.icons) {
		return null;
	}
	let biggestIcon = {
		size: 0,
		icon: null as null | { src: string; sizes: string; type: string | null },
	};
	if (Array.isArray(manifest.icons)) {
		for (const manifestIcon of manifest.icons) {
			const sizeArr = parseManifestIconSrcString(manifestIcon.sizes);
			for (const size of sizeArr) {
				if (size > biggestIcon.size) {
					biggestIcon = {
						size,
						icon: manifestIcon,
					};
				}
			}
		}
		return biggestIcon;
	}

	for (const [sizes, src] of Object.entries(manifest.icons)) {
		// There can only be one size in this mapping.
		const size = parseManifestIconSrcString(sizes)[0];
		if (size > biggestIcon.size) {
			biggestIcon = {
				size,
				icon: {
					src,
					sizes: `${size}x${size}`,
					type: null,
				},
			};
		}
	}

	return biggestIcon;
};
