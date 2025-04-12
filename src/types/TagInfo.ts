export interface TagInfo {
	displayName: string;
	emoji?: string;
	image?: string;

	// Markdown explainer for tag attribution/licensing
	explainerHtml?: string;
	explainerType?: "license" | "attribution";
	// whether the tag can be shown with site branding
	// e.g. in the homepage banner
	shownWithBranding?: boolean;
}
