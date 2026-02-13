import { SitemapIndexStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import { siteUrl } from "constants/site-config";

export const GET = async () => {
	const entries = [{ url: `${siteUrl}/sitemap-0.xml` }];

	const stream = new SitemapIndexStream();

	const sitemap = (
		await streamToPromise(Readable.from(entries).pipe(stream))
	).toString();
	return new Response(sitemap, {
		headers: { "Content-Type": "application/xml" },
	});
};
