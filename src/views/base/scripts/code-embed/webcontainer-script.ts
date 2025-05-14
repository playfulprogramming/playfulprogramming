import { WebContainer, type WebContainerProcess } from "@webcontainer/api";
import { unzip, type Unzipped } from "fflate";

interface EmbedInstance {
	projectZipUrl: string;
	process?: WebContainerProcess;
	processUrl?: string;
	elements: EmbedElements[];
}

interface EmbedElements {
	formEl: HTMLFormElement;
	addressEl: HTMLInputElement;
	reloadButtonEl: HTMLButtonElement;

	runButtonEl: HTMLButtonElement;
	loaderEl: HTMLElement;
	loaderConsoleEl: HTMLElement;
	previewContainerEl: HTMLElement;
	iframeEl: HTMLIFrameElement;
}

let webContainerInstance: WebContainer | undefined = undefined;
let isInitialized = false;
let currentEmbed: EmbedInstance | undefined = undefined;

const isSupported =
	typeof SharedArrayBuffer === "function" && window.crossOriginIsolated;

async function createWebContainer(): Promise<WebContainer> {
	if (isInitialized) return webContainerInstance!;
	isInitialized = true;

	// This should only run once!
	const i = (webContainerInstance = await WebContainer.boot());

	i.on("server-ready", (port, url) => {
		if (currentEmbed) {
			currentEmbed.processUrl = url;
			currentEmbed.elements.forEach((els) => {
				const modifiedUrl = modifyPreviewUrl(url, els.addressEl.value);
				els.iframeEl.src = modifiedUrl;
				updateServerUrl(els, modifiedUrl);
				els.previewContainerEl.replaceChildren(els.iframeEl);
			});
		}
	});

	return i;
}

// Store shared embed instances (iframes using the same zip + run command, which can share a webcontainer)
const embedInstances = new Map<string, EmbedInstance>();

function createConsoleStream(command: string) {
	return new WritableStream({
		write(data) {
			// Omit any ANSI formatting codes from the console text
			const consoleText = String(data)
				// eslint-disable-next-line no-control-regex
				.replace(/(\x9B|\x1B\[|\uFFFD\[)[0-?]*[ -\/]*[@-~]/g, "")
				.trim();
			if (consoleText) {
				console.log(consoleText);
				const message = `(${command}) ${consoleText.replace(/[\r\n].*$/, "")}`;
				currentEmbed?.elements.forEach((els) => {
					els.loaderConsoleEl.innerText = message;
				});
			}
		},
	});
}

async function runEmbed(embed: EmbedInstance) {
	if (currentEmbed === embed) {
		// If the embed is already active, do nothing
		return;
	}

	if (currentEmbed) {
		// If a different embed is active, stop it and replace with this one
		currentEmbed.process?.kill();
		currentEmbed.elements.forEach((els) => {
			els.iframeEl.replaceWith(els.runButtonEl);
		});
	}

	currentEmbed = embed;

	embed.elements.forEach((els) => {
		els.loaderConsoleEl.innerText = "";
		els.previewContainerEl.replaceChildren(els.loaderEl);
		els.loaderEl.dataset.step = "download";
	});

	const i = await createWebContainer();
	await i.fs.rm("/*", { force: true, recursive: true });

	const projectBuffer = await fetch(embed.projectZipUrl).then((r) =>
		r.arrayBuffer(),
	);
	const contents: Unzipped = await new Promise((res, rej) => {
		unzip(new Uint8Array(projectBuffer), (err, data) => {
			if (data) res(data);
			else rej(err);
		});
	});

	console.log("Extracting project.zip");
	for (const [path, fileArr] of Object.entries(contents)) {
		if (fileArr.length === 0) {
			await i.fs.mkdir(path, { recursive: true });
		} else {
			if (path.includes("/")) {
				const dir = path.replace(/\/[^/]*$/, "");
				await i.fs.mkdir(dir, { recursive: true });
			}
			await i.fs.writeFile(path, fileArr);
		}
	}

	embed.elements.forEach((els) => {
		els.loaderEl.dataset.step = "install";
	});

	console.log("npm install...");
	const installProcess = await i.spawn("npm", ["install"], {
		env: { TERM: "plain" },
	});
	installProcess.output.pipeTo(createConsoleStream("npm install"));
	if ((await installProcess.exit) !== 0) {
		throw new Error("Unable to run npm install");
	}

	embed.elements.forEach((els) => {
		els.loaderEl.dataset.step = "start";
	});

	console.log("npm run start...");
	embed.process = await i.spawn("npm", ["run", "start"]);
	embed.process.output.pipeTo(createConsoleStream("npm run start"));
}

const loaderTemplateEl = document.querySelector<HTMLTemplateElement>(
	"#webcontainer-loader",
)!;

for (const containerEl of Array.from(
	document.querySelectorAll<HTMLElement>("[data-code-embed=webcontainer]"),
)) {
	const projectZipUrl = containerEl.dataset.projectZip!;
	const runButtonEl = containerEl.querySelector<HTMLButtonElement>(
		"#code-embed-run-preview",
	)!;
	const reloadButtonEl = containerEl.querySelector<HTMLButtonElement>(
		"#code-embed-reload-preview",
	)!;
	let iframeEl = document.createElement("iframe");
	const formEl = containerEl.querySelector<HTMLFormElement>(
		"#code-embed-address",
	)!;
	const addressEl = formEl.querySelector<HTMLInputElement>(
		'input[name="address"]',
	)!;
	const previewContainerEl = containerEl.querySelector<HTMLElement>(
		"#code-embed-preview-container",
	)!;

	// If webcontainers are not supported by the browser, hide the preview embed
	if (!isSupported) {
		formEl.remove();
		previewContainerEl.remove();
		continue;
	}

	const loaderEl = (
		loaderTemplateEl.content.cloneNode(true) as HTMLElement
	).querySelector<HTMLElement>("#code-embed-loader")!;
	const loaderConsoleEl = loaderEl.querySelector<HTMLElement>(
		"#code-embed-loader-console",
	)!;

	const existingEmbedInstance = embedInstances.get(projectZipUrl);
	const embedInstance = existingEmbedInstance ?? {
		projectZipUrl,
		elements: [],
	};

	if (embedInstance != existingEmbedInstance) {
		embedInstances.set(projectZipUrl, embedInstance);
	}

	const elements: EmbedElements = {
		runButtonEl,
		reloadButtonEl,
		iframeEl,
		formEl,
		addressEl,
		previewContainerEl,
		loaderEl,
		loaderConsoleEl,
	};

	embedInstance.elements.push(elements);

	function replaceIframe(newSrc: string) {
		const newIframeEl = document.createElement("iframe");
		newIframeEl.src = newSrc;

		iframeEl.replaceWith(newIframeEl);
		elements.iframeEl = iframeEl = newIframeEl;
		bindIframeEvents();
	}

	runButtonEl.addEventListener("click", () => {
		runEmbed(embedInstance);
	});

	reloadButtonEl.addEventListener("click", (e) => {
		e.preventDefault();

		runEmbed(embedInstance);
		formEl.reset();

		if (embedInstance.processUrl) {
			const newSrc = modifyPreviewUrl(
				embedInstance.processUrl,
				addressEl.value,
			);
			replaceIframe(newSrc);
		}
	});

	formEl.addEventListener("submit", (e) => {
		e.preventDefault();
		runEmbed(embedInstance);

		if (embedInstance.processUrl) {
			const newSrc = modifyPreviewUrl(
				embedInstance.processUrl,
				addressEl.value,
			);
			replaceIframe(newSrc);
		}
	});

	function bindIframeEvents() {
		// If the iframe is navigated, modify the address bar to reflect the new URL
		iframeEl.addEventListener("load", () => {
			if (iframeEl.src) {
				updateServerUrl(elements, iframeEl.src);
			}
		});
	}

	bindIframeEvents();
}

// Given the base webcontainer URL, modify it with any changes made in the address bar
function modifyPreviewUrl(previewUrl: string, addressUrl: string) {
	const newUrl = new URL(addressUrl, "http://localhost");
	const srcUrl = new URL(previewUrl);
	srcUrl.pathname = newUrl.pathname;
	srcUrl.search = newUrl.search;
	srcUrl.hash = newUrl.hash;

	return srcUrl.toString();
}

// Given the webcontainer URL, shorten the hostname for display purposes
function updateServerUrl(elements: EmbedElements, url: string) {
	const serverUrl = new URL(url);
	elements.addressEl.value = serverUrl
		.toString()
		.substring(serverUrl.protocol.length + serverUrl.hostname.length + 3);
}
