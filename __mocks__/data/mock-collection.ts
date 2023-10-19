import { MockUnicorn, MockUnicornTwo } from "./mock-unicorn";
import { MockLicense } from "./mock-license";
import { ExtendedCollectionInfo, ExtendedPostInfo } from "types/index";
import { MockPost } from "./mock-post";

export const MockCollection: ExtendedCollectionInfo = {
	authors: [MockUnicorn.id],
	authorsMeta: [MockUnicorn],
	Content: () => null,
	tags: [],
	contentMeta: "",
	licenseMeta: null,
	publishedMeta: "October 10, 2010",
	collectionSlug: null,
	excerpt: "This would be an auto generated excerpt of the post in particular",
	wordCount: 10000,
	coverImgMeta: {
		absoluteFSPath: "",
		height: 0,
		relativePath: "",
		relativeServerPath: "",
		width: 0,
	},
	locales: ["en"],
	locale: "en",
	slug: "this-collection-name-here",
	title: "Collection title",
	description: "This is a short description dunno why this would be this short",
	coverImg: "img.png",
	published: "10-10-2010T00:00:00.000Z",
	buttons: [],
};
