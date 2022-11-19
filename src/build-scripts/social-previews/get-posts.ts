import { getAllPosts } from "utils/fs/posts-and-collections-api";

export function getSocialPosts() {
	const posts = getAllPosts(
		{
			title: true,
			published: true,
			slug: true,
			authors: {
				id: true,
				name: true,
				profileImg: true,
			},
			content: true,
		} as const,
		"en"
	);
	return posts;
}

export type PreviewPost = ReturnType<typeof getSocialPosts>[number];
