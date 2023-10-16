import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

let siteUrl = process.env.SITE_URL || process.env.VERCEL_URL || "";
if (siteUrl && !siteUrl.startsWith("http")) siteUrl = `https://${siteUrl}`;

const GITHUB_CLIENT_ID = process.env.CMS_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.CMS_GITHUB_CLIENT_SECRET;

type OAuthResponse = {
	access_token: string;
	scope: string;
	token_type: string;
};

export default async (req: VercelRequest, res: VercelResponse) => {
	const code = req.query.code!;

	const url = new URL(req.url);
	const response = (await fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		body: JSON.stringify({
			client_id: GITHUB_CLIENT_ID,
			client_secret: GITHUB_CLIENT_SECRET,
			code,
			redirect_uri: url.origin + url.pathname,
		}),
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	}).then((r) => r.json())) as OAuthResponse;

	if (response?.access_token) {
		res.setHeader(
			"Set-Cookie",
			`CMS-GitHub-Token=${response.access_token}; SameSite=Strict; Path=/admin; Secure`,
		);
	}

	res.redirect(307, siteUrl + "/admin/");
};
