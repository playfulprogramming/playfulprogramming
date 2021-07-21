const visit = require('unist-util-visit');

module.exports = async (
	{ markdownAST },
	options = { width: 600, height: 300, domain: '' }
) => {
	if (!options.domain) {
		console.error('You must configure a domain for Gatsby Remark Twitch');
		return;
	}
	let parent = options.domain;
	// Try & Catch to allow for hosts themselves to be passed
	// `new URL('domain.com')` will fail/throw, but is a valid host
	try {
		const url = new URL(options.domain);
		// URLs like 'localhost:3000' might not give host.
		// Throw in order to catch in wrapper handler
		if (!url.host) throw new Error();
	} catch (_) {
		const url = new URL('https://' + options.domain);
		parent = url.host || parent;
	}

	// Twitch embedd throws error with strings like 'localhost:3000', but
	// those persist with `new URL().host`
	if (parent.startsWith('localhost')) {
		parent = 'localhost';
	}

	visit(markdownAST, 'text', async (node) => {
		const { value } = node;
		const twitchVideo = value.match(
			/https:\/\/(www\.)?twitch\.tv\/videos\/([A-Za-z0-9-_?=]*)/gi
		);
		const twitchClip = value.match(
			/https:\/\/(www\.)?clips\.twitch\.tv\/([A-Za-z0-9-_?=]*)/gi
		);
		const twitchChannel = value.match(
			/https:\/\/(www\.)?twitch\.tv\/([A-Za-z0-9-_?=]*)$/gi
		);

		if (twitchVideo) {
			const videoId = value.split('/').pop();

			node.type = 'html';
			node.value = `<div><iframe
        src='https://player.twitch.tv/?video=${videoId}&autoplay=false&parent=${parent}'
        height='${options.height}'
        width='${options.width}'
        frameborder='0'
        scrolling='no'
        allowfullscreen='true'>
      </iframe></div>`;
		}

		if (twitchClip) {
			const clipId = value.split('/').pop();

			node.type = 'html';
			node.value = `<div><iframe
        src='https://clips.twitch.tv/embed?clip=${clipId}&autoplay=false&parent=${parent}'
        height='${options.height}'
        width='${options.width}'
        frameborder='0'
        scrolling='no'
        allowfullscreen='true'>
      </iframe></div>`;
		}
		if (twitchChannel) {
			const channelName = value.split('/').pop();

			node.type = 'html';
			node.value = `<div><iframe
        src='https://player.twitch.tv/?channel=${channelName}&muted=false&parent=${parent}'
        height='${options.height}'
        width='${options.width}'
        frameborder='0'
        scrolling='no'
        allowfullscreen='true'>
      </iframe></div>`;
		}
	});

	return markdownAST;
};
