import { siteUrl } from "#src/constants/site-config.ts";

export const GET = () => {
	const body = `
# *
User-agent: *
Disallow: /

# Host
Host: ${siteUrl}

# Sitemaps
Sitemap: ${siteUrl}/sitemap-index.xml
        `.trim();
	return new Response(body);
};
