export interface LocalFile {
	// Relative to "public/people"
	relativePath: string;
	// Relative to site root
	relativeServerPath: string;
	// This is not stored, it's generated at build time
	absoluteFSPath: string;
	height: number;
	width: number;
}
