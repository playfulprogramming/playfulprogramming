import { MockUnicorn, MockUnicornTwo } from "./mock-unicorn";
import { MockLicense } from "./mock-license";
import { ExtendedPostInfo } from "types/index";

export const MockPost: ExtendedPostInfo = {
	excerpt: "This would be an auto generated excerpt of the post in particular",
	title: "Post title",
	published: "10-10-2010T00:00:00.000Z",
	publishedMeta: "October 10, 2010",
	tags: ["item1"],
	description: "This is a short description dunno why this would be this short",
	authors: [MockUnicorn.id],
	authorsMeta: [MockUnicorn],
	license: MockLicense.id,
	licenseMeta: MockLicense,
	locale: "en",
	locales: ["en", "es"],
	slug: "this-post-name-here",
	headingsWithId: [],
	wordCount: 10000,
	contentMeta: "",
	translations: {
		en: "English",
	},
	Content: {} as never,
	suggestedArticles: [] as never,
	attached: [],
};

export const MockMultiAuthorPost: ExtendedPostInfo = {
	excerpt:
		"This would be a second auto generated excerpt of the post in particular",
	title: "Another post title",
	published: "10-20-2010T00:00:00.000Z",
	publishedMeta: "October 20, 2010",
	tags: ["item1"],
	description:
		"This is another short description dunno why this would be this short",
	authors: [MockUnicornTwo.id, MockUnicorn.id],
	authorsMeta: [MockUnicornTwo, MockUnicorn],
	license: MockLicense.id,
	licenseMeta: MockLicense,
	locale: "en",
	locales: ["en", "es"],
	slug: "this-other-post-name-here",
	headingsWithId: [],
	wordCount: 100000,
	contentMeta: "",
	translations: {
		en: "English",
	},
	Content: {} as never,
	suggestedArticles: [] as never,
	attached: [],
};

export const MockMuliLanguagePost: ExtendedPostInfo = {
	excerpt:
		"This would be a second auto generated excerpt of the post in particular",
	title: "Another post title",
	published: "10-20-2010T00:00:00.000Z",
	publishedMeta: "October 20, 2010",
	tags: ["item1"],
	description:
		"This is another short description dunno why this would be this short",
	authors: [MockUnicornTwo.id, MockUnicorn.id],
	authorsMeta: [MockUnicornTwo, MockUnicorn],
	license: MockLicense.id,
	licenseMeta: MockLicense,
	locale: "en",
	locales: ["en", "es"],
	slug: "this-other-post-name-here",
	headingsWithId: [],
	wordCount: 100000,
	contentMeta: "",
	translations: {
		es: "Español",
	},
	Content: {} as never,
	suggestedArticles: [] as never,
	attached: [],
};

export const MockCanonicalPost: ExtendedPostInfo = {
	excerpt:
		"This would be a second auto generated excerpt of the post in particular",
	title: "Another post title",
	published: "10-20-2010T00:00:00.000Z",
	publishedMeta: "October 20, 2010",
	originalLink: "https://google.com/",
	tags: ["item1"],
	description:
		"This is another short description dunno why this would be this short",
	authors: [MockUnicornTwo.id, MockUnicorn.id],
	authorsMeta: [MockUnicornTwo, MockUnicorn],
	license: MockLicense.id,
	licenseMeta: MockLicense,
	locale: "en",
	locales: ["en", "es"],
	slug: "this-other-post-name-here",
	headingsWithId: [],
	wordCount: 100000,
	contentMeta: "",
	translations: {
		en: "English",
	},
	Content: {} as never,
	suggestedArticles: [] as never,
	attached: [],
};
