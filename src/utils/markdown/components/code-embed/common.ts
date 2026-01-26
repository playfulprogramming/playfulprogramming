// Given the base webcontainer URL, modify it with any changes made in the address bar
export function modifyProcessUrl(processUrl: string, addressUrl: string) {
	const newUrl = new URL(addressUrl, "http://localhost");
	const srcUrl = new URL(processUrl);
	srcUrl.pathname = newUrl.pathname;
	srcUrl.search = newUrl.search;
	srcUrl.hash = newUrl.hash;

	return srcUrl.toString();
}

// Given the webcontainer URL, shorten the hostname for display purposes
export function shortenProcessUrl(url: string): string {
	const serverUrl = new URL(url);
	serverUrl.hostname = "localhost";
	serverUrl.port = "";
	return serverUrl.toString();
}
