import { Button } from "components/button/button";
import * as data from "src/utils/data";

import discord from "src/icons/discord.svg?raw";
import linkedin from "src/icons/linkedin.svg?raw";
import twitter from "src/icons/twitter.svg?raw";
import mastodon from "src/icons/mastodon.svg?raw";
import facebook from "src/icons/facebook.svg?raw";
import rss from "src/icons/rss.svg?raw";

const icons: Record<string, string> = { discord, linkedin, twitter, mastodon, facebook, rss };

// Components used in the .MDX about files
// - see /content/site/about-us*.mdx for usages

// None of these components should include any SCSS styles!
// This is because of an astro CSS scoping bug:
// - https://github.com/withastro/astro/issues/3816

export function Links() {
	return (
		<ul class="links" role="list" aria-label="Social media links">
			{Object.entries(data.about.links).map(([name, link]) => (
				<li>
					<Button
						variant="primary"
						href={link.url}
						leftIcon={<span dangerouslySetInnerHTML={{ __html: icons[link.icon]! }} />}
					>
						{name}
					</Button>
				</li>
			))}
		</ul>
	);
}

export function Sponsors() {
	return (
		<ul class="sponsors" role="list" aria-labelledby="sponsors">
			{Object.values(data.about.sponsors).map(({ name, logo, url }) => (
				<li>
					<a href={url}>
						<img data-dont-round="true" height="300" width="122" alt={name} src={logo} loading="lazy"/>
					</a>
				</li>
			))}
		</ul>
	);
}
