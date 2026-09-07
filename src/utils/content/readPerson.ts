import {
	PersonInfoSchema,
	type PersonInfo,
	type PersonStub,
} from "#types/PersonInfo.ts";
import { resolvePath } from "../url-paths.ts";
import { getImageSize } from "../get-image-size.ts";
import type { MarkdownVFile } from "../markdown/types.ts";
import { parseFrontmatter } from "./parseFrontmatter.ts";
import { logError } from "../markdown/logger.ts";
import { cache } from "./common.ts";
import { posts } from "../data.ts";
import { isDefined } from "../is-defined.ts";
import { readPost } from "./readPost.ts";

export const readPerson = cache(
	async (stub: PersonStub, vfile: MarkdownVFile): Promise<PersonInfo> => {
		const personPath = stub.file.split("/").slice(0, -1).join("/");
		const { frontmatter, frontmatterNode } = await parseFrontmatter(
			vfile,
			PersonInfoSchema,
		);

		const profileImgSize = frontmatter.profileImg
			? await getImageSize(frontmatter.profileImg, personPath)
			: undefined;
		if (!profileImgSize || !profileImgSize.width || !profileImgSize.height) {
			logError(vfile, frontmatterNode, "Unable to parse profile image size");
		}

		const totalPostStubs = [...posts.values()]
			.flatMap((locales) => locales.find((p) => p.locale == stub.locale))
			.filter(isDefined)
			.filter((p) => p.authors.includes(stub.id));
		const totalWordCount = (
			await Promise.all(
				totalPostStubs.map((p) => readPost(p).then((p) => p.wordCount)),
			)
		).reduce((prev, curr) => prev + curr, 0);

		const person: PersonInfo = {
			firstName: "",
			lastName: "",
			pronouns: "",
			color: "",
			...frontmatter,
			...stub,
			totalPostCount: totalPostStubs.length,
			totalWordCount,
			profileImgMeta: {
				height: profileImgSize?.height ?? 0,
				width: profileImgSize?.width ?? 0,
				...resolvePath(frontmatter.profileImg, personPath)!,
			},
		};

		// normalize social links - if a URL or "@name" is entered, only preserve the last part
		const normalizeUsername = (username: string | undefined) =>
			username?.trim()?.replace(/^.*[/@](?!$)/, "");

		person.socials.twitter = normalizeUsername(person.socials.twitter);
		person.socials.github = normalizeUsername(person.socials.github);
		person.socials.gitlab = normalizeUsername(person.socials.gitlab);
		person.socials.linkedIn = normalizeUsername(person.socials.linkedIn);
		person.socials.twitch = normalizeUsername(person.socials.twitch);
		person.socials.dribbble = normalizeUsername(person.socials.dribbble);
		person.socials.threads = normalizeUsername(person.socials.threads);
		person.socials.cohost = normalizeUsername(person.socials.cohost);

		// "mastodon" should be a full URL; this will error if not valid
		try {
			if (person.socials.mastodon)
				person.socials.mastodon = new URL(person.socials.mastodon).toString();
		} catch (e) {
			console.error(
				`'${person.id}' socials.mastodon is not a valid URL: '${person.socials.mastodon}'`,
			);
			throw e;
		}

		// "bluesky" should be a full URL; this will error if not valid
		try {
			if (person.socials.bluesky)
				person.socials.bluesky = new URL(person.socials.bluesky).toString();
		} catch (e) {
			console.error(
				`'${person.id}' socials.mastodon is not a valid URL: '${person.socials.bluesky}'`,
			);
			throw e;
		}

		if (person.socials.youtube) {
			// this can either be a "@username" or "channel/{id}" URL, which cannot be mixed.
			const username = normalizeUsername(person.socials.youtube);
			person.socials.youtube = person.socials.youtube.includes("@")
				? `https://www.youtube.com/@${username}`
				: `https://www.youtube.com/channel/${username}`;
		}

		return person;
	},
);
