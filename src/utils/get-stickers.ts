/**
 * These are the allowed stickers to be shown within our branding assets
 *
 * IE: Homepage, search page initial state, etc
 *
 * All of these stickers must be vetted manually for licencing rights and, if requested,
 * must be removed.
 *
 * If you own the rights to these assets and would like yours removed, please email us at:
 * licensing@unicorn-utterances.com
 */
export function getStickers() {
	return [
		{
			src: "/stickers/android.svg",
			explainer:
				"https://developer.android.com/distribute/marketing-tools/brand-guidelines#android_robot",
		},
		{
			src: "/stickers/angular.svg",
			explainer: "https://angular.io/presskit#official-angular-logo",
		},
		{
			src: "/stickers/css.svg",
			explainer:
				"https://en.wikipedia.org/wiki/CSS#/media/File:CSS3_logo_and_wordmark.svg",
		},
		{
			src: "/stickers/html.svg",
			explainer:
				"https://en.wikipedia.org/wiki/HTML#/media/File:HTML5_logo_and_wordmark.svg",
		},
		{
			src: "/stickers/python.svg",
			explainer: "https://www.python.org/psf/trademarks/",
		},
		{
			src: "/stickers/react.svg",
			explainer:
				"https://github.com/facebook/react/issues/12570#issuecomment-411130246",
		},
		{
			src: "/stickers/typescript.svg",
			explainer:
				"https://github.com/microsoft/TypeScript-Website/blob/v2/LICENSE",
		},
		{
			src: "/stickers/javascript.svg",
			explainer: "https://github.com/voodootikigod/logo.js/blob/master/LICENSE",
		},
		{
			src: "/stickers/linux.svg",
			explainer:
				"https://web.archive.org/web/20191001080512/https://isc.tamu.edu/~lewing/linux/",
		},
		{ src: "/stickers/vue.svg", explainer: "https://github.com/vuejs/art" },
		{
			src: "/stickers/ferris.svg",
			explainer:
				"https://foundation.rust-lang.org/policies/logo-policy-and-media-guide/",
		},
		{
			src: "/stickers/git.svg",
			explainer: "https://git-scm.com/downloads/logos",
		},
		{
			src: "/stickers/cpp.svg",
			explainer: "https://isocpp.org/home/terms-of-use",
		},
	] satisfies Sticker[];
}

interface Sticker {
	// The src on the Unicorn Utterances site
	src: string;
	// The explainer for why we should have the ability to display this logo
	explainer: string;
}
