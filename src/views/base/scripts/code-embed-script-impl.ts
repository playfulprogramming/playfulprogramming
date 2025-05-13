import { WebContainer, type WebContainerProcess } from "@webcontainer/api";
import { unzip, type Unzipped } from "fflate";

interface EmbedInstance {
	projectZipUrl: string;
	process?: WebContainerProcess;
	elements: EmbedElements[];
}

interface EmbedElements {
	runButtonEl: HTMLButtonElement;
	iframeEl: HTMLIFrameElement;
	formEl: HTMLFormElement;
	addressEl: HTMLInputElement;
}

let webContainerInstance: WebContainer | undefined = undefined;
let isInitialized = false;
let currentEmbed: EmbedInstance | undefined = undefined;

async function createWebContainer(): Promise<WebContainer> {
	if (isInitialized) return webContainerInstance!;
	isInitialized = true;

	// This should only run once!
	const i = (webContainerInstance = await WebContainer.boot());

	i.on("server-ready", (port, url) => {
		if (currentEmbed) {
			currentEmbed.elements.forEach((els) => {
				const modifiedUrl = modifyPreviewUrl(url, els.addressEl.value);
				console.log(modifiedUrl, els.addressEl);
				els.iframeEl.src = modifiedUrl;
				updateServerUrl(els, modifiedUrl);
			});
		}
	});

	return i;
}

// Store shared embed instances (iframes using the same zip + run command, which can share a webcontainer)
const embedInstances = new Map<string, EmbedInstance>();

function createConsoleStream() {
	return new WritableStream({
		write(data) {
			console.log("Container:", data);
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

	const i = await createWebContainer();
	await i.fs.rm("/*", { force: true, recursive: true });

	embed.elements.forEach((els) => {
		els.runButtonEl.replaceWith(els.iframeEl);
	});

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

	console.log("npm install...");
	const installProcess = await i.spawn("npm", ["install"], {
		env: { TERM: "plain" },
	});
	installProcess.output.pipeTo(createConsoleStream());
	if ((await installProcess.exit) !== 0) {
		throw new Error("Unable to run npm install");
	}

	console.log("npm run dev...");
	embed.process = await i.spawn("npm", ["run", "start"]);
	embed.process.output.pipeTo(createConsoleStream());
}

for (const containerEl of Array.from(
	document.querySelectorAll<HTMLElement>("[data-code-embed=webcontainer]"),
)) {
	const projectZipUrl = containerEl.dataset.projectZip!;
	const runButtonEl = containerEl.querySelector<HTMLButtonElement>(
		"#code-embed-run-preview",
	)!;
	let iframeEl = document.createElement("iframe");
	const formEl = containerEl.querySelector<HTMLFormElement>(
		"#code-embed-address",
	)!;
	const addressEl = formEl.querySelector<HTMLInputElement>(
		'input[name="address"]',
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
		iframeEl,
		formEl,
		addressEl,
	};

	embedInstance.elements.push(elements);

	runButtonEl.addEventListener("click", async () => {
		await runEmbed(embedInstance);
	});

	formEl.addEventListener("submit", (e) => {
		if (embedInstance != currentEmbed) {
			runEmbed(embedInstance);
		}

		if (iframeEl.src) {
			try {
				const newIframeEl = document.createElement("iframe");
				newIframeEl.src = modifyPreviewUrl(iframeEl.src, addressEl.value);

				iframeEl.replaceWith(newIframeEl);
				elements.iframeEl = iframeEl = newIframeEl;
				bindIframeEvents();
			} catch (e) {
				console.error(e);
			}
		}
		e.preventDefault();
		return false;
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
	const newUrl = new URL(addressUrl);
	const srcUrl = new URL(previewUrl);
	srcUrl.pathname = newUrl.pathname;
	srcUrl.search = newUrl.search;
	srcUrl.hash = newUrl.hash;

	return srcUrl.toString();
}

// Given the webcontainer URL, shorten the hostname for display purposes
function updateServerUrl(elements: EmbedElements, url: string) {
	const serverUrl = new URL(url);
	serverUrl.protocol = "http";
	serverUrl.host = `localhost`;
	elements.addressEl.value = serverUrl.toString();
}
