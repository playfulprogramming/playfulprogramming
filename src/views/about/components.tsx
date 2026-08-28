import { Button } from "#components/button/button.tsx";
import * as data from "#utils/data.ts";

import discord from "#src/assets/icons/discord.svg?raw";
import linkedin from "#src/assets/icons/linkedin.svg?raw";
import twitter from "#src/assets/icons/twitter.svg?raw";
import mastodon from "#src/assets/icons/mastodon.svg?raw";
import bluesky from "#src/assets/icons/bluesky.svg?raw";
import facebook from "#src/assets/icons/facebook.svg?raw";
import rss from "#src/assets/icons/rss.svg?raw";
import youtube from "#src/assets/icons/youtube.svg?raw";
import { m } from "#src/paraglide/messages.js";

const icons: Record<string, string> = {
	discord,
	linkedin,
	twitter,
	mastodon,
	bluesky,
	facebook,
	rss,
	youtube,
};

export function Links() {
	return (
		<ul class="links" role="list" aria-label={m.label_social_media_links()}>
			{Object.entries(data.about.links).map(([name, link]) => (
				<li key={name}>
					<Button
						variant="primary"
						href={link.url}
						rel={name === "Mastodon" ? "me" : undefined}
						leftIcon={
							<span dangerouslySetInnerHTML={{ __html: icons[link.icon]! }} />
						}
					>
						{name}
					</Button>
				</li>
			))}
		</ul>
	);
}
