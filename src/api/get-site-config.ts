const buildMode: string = process.env.BUILD_ENV || "production";

let siteUrl: string = process.env.SITE_URL || '';

if (!siteUrl) {
    switch (buildMode) {
        case "production":
            siteUrl = "https://unicorn-utterances.com";
            break;
        case "local":
            siteUrl = "localhost:3000";
            break;
        default:
            siteUrl = "https://beta.unicorn-utterances.com";
    }
}

// To set for Twitch
let parent: string;

// Try & Catch to allow for hosts themselves to be passed
// `new URL('domain.com')` will fail/throw, but is a valid host
try {
    const url = new URL(siteUrl);
    // URLs like 'localhost:3000' might not give host.
    // Throw in order to catch in wrapper handler
    if (!url.host) throw new Error();
    parent = url.host;
} catch (_) {
    const url = new URL("https://" + siteUrl);
    parent = url.host;
}

// Twitch embed throws error with strings like 'localhost:3000', but
// those persist with `new URL().host`
if (parent.startsWith("localhost")) {
    parent = "localhost";
}

export {
    parent,
    siteUrl,
    buildMode
}
