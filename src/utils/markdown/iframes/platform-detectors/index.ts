import { videoPlatformDetector } from "./video";
import { xPlatformDetector } from "./x";
import { gistPlatformDetector } from "./gist";

export const platformDetectors = [
	videoPlatformDetector,
	xPlatformDetector,
	gistPlatformDetector,
];
