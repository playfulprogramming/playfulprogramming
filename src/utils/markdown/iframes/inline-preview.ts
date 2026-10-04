/** Inline previews must use root-relative URLs, never external URLs. */
export function isInlinePreviewSource(src: string): boolean {
	// Browsers treat backslashes as slashes and ignore tabs and line breaks in URLs.
	return /^\/(?![\\/])/.test(src) && !/[\t\n\r]/.test(src);
}
