import { RawCollectionInfo } from "types/CollectionInfo";

const collectionMapping: Array<RawCollectionInfo & { slug: string }> = [
	{
		slug: "framework-field-guide",
		title: "The Framework Field Guide",
		description:
			"A practical and free way to teach Angular, React, and Vue all at once, so you can choose the right tool for the job and learn the underlying concepts in depth.",
		authors: ["crutchcorn"],
		coverImg: "/custom-content/collections/framework-field-guide/cover.png",
		socialImg:
			"/custom-content/collections/framework-field-guide/framework_field_guide_social.png",
		type: "book",
		tags: ["react", "angular", "vue"],
		published: "2024-01-01T13:45:00.284Z",
		buttons: [
			{ text: "Learn more", url: "/collections/framework-field-guide" },
		],
		customChaptersText: "3 books",
	},
	{
		slug: "framework-field-guide-fundamentals",
		title: "The Framework Field Guide - Fundamentals",
		description:
			"A practical and free way to teach Angular, React, and Vue all at once, so you can choose the right tool for the job and learn the underlying concepts in depth.",
		authors: ["crutchcorn"],
		coverImg:
			"/custom-content/collections/framework-field-guide-fundamentals/cover.png",
		socialImg:
			"/custom-content/collections/framework-field-guide/framework_field_guide_social.png",
		type: "book",
		tags: ["react", "angular", "vue"],
		published: "2024-01-01T13:45:00.284Z",
		buttons: [],
	},
];

export default collectionMapping;
