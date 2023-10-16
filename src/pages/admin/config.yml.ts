import { languages } from "constants/index";
import { siteUrl } from "constants/site-config";
import { licenses, tags } from "utils/data";
import YAML from "yaml";

const decapConfig = {
	backend: {
		name: "github",
		repo: "unicorn-utterances/unicorn-utterances",
		branch: "main",
		// auth_endpoint: siteUrl + "/github-auth",
		auth_scope: "repo",

		// https://decapcms.org/docs/beta-features/#open-authoring
		open_authoring: true,
	},

	publish_mode: "editorial_workflow",
	media_folder: "public/uploads",
	public_folder: "/uploads",

	site_url: siteUrl,
	logo_url: siteUrl + "/icons/icon-512x512.png",

	show_preview_links: false,
	search: false,

	collections: [
		{
			name: "posts",
			label: "Articles",
			label_singular: "Article",
			folder: "content/blog",
			create: true,
			extension: "md",
			format: "frontmatter",
			slug: "{{title}}",

			// Specifies the file path to be "slug/index.md"
			// https://decapcms.org/docs/beta-features/#folder-collections-path
			path: "{{slug}}/index",

			// Stores media in the same dir relative to the post "index" file
			// https://decapcms.org/docs/beta-features/#folder-collections-media-and-public-folder
			media_folder: "",
			public_folder: "",

			fields: [
				{
					label: "Title",
					name: "title",
					widget: "string",
				},
				{
					label: "Description",
					name: "description",
					widget: "text",
				},
				{
					label: "Published Date",
					name: "published",
					widget: "datetime",
					format: "YYYY-MM-DD",
				},
				{
					label: "Edited Date",
					name: "edited",
					widget: "datetime",
					format: "YYYY-MM-DD",
					required: false,
				},
				{
					label: "Tags",
					name: "tags",
					widget: "select",
					options: [...tags.entries()].map(([key, tag]) => ({
						label: tag.displayName,
						value: key,
					})),
					multiple: true,
					min: 0,
					max: 4,
					required: false,
				},
				{
					label: "License",
					name: "license",
					widget: "select",
					options: licenses.map((l) => ({
						label: l.displayName,
						value: l.id,
					})),
					required: false,
				},
				{
					label: "Body",
					name: "body",
					widget: "markdown",
				},
			],
		},
	],

	// https://decapcms.org/docs/beta-features/#i18n-support
	// i18n support would be great, but it currently creates empty files for
	// every configured locale; whereas we want any locale to be optional for the poster.
	/* i18n: {
    structure: "multiple_files",
    locales: Object.keys(languages),
    default_locale: "en",
  }, */
};

export const get = () => {
	return { body: YAML.stringify(decapConfig) };
};
