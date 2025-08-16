import { WebContainer, type WebContainerProcess } from "@webcontainer/api";
import { unzip, type Unzipped } from "fflate";
import { atom } from "nanostores";

let webContainerInstance: WebContainer | undefined = undefined;
let isInitialized = false;
let currentProcess: WebContainerProcess | undefined = undefined;

export const isSupported =
	import.meta.env.SSR ||
	(typeof SharedArrayBuffer === "function" && window.crossOriginIsolated);

interface WebContainerState {
	projectId?: string;
	loading?: "download" | "install" | "start";
	error?: boolean;
	consoleProcess?: string;
	consoleOutput?: string;
	processUrl?: string;
}

export const $container = atom<WebContainerState>({});

async function createWebContainer(): Promise<WebContainer> {
	if (isInitialized) return webContainerInstance!;
	isInitialized = true;

	// This should only run once!
	const i = (webContainerInstance = await WebContainer.boot());

	i.on("server-ready", (_port: number, url: string) => {
		$container.set({
			...$container.get(),
			loading: undefined,
			consoleProcess: undefined,
			consoleOutput: undefined,
			processUrl: url,
		});
	});

	i.on("error", (error: { message: string }) => {
		console.error("WebContainer:", error.message);
	});

	i.on("preview-message", (message: object) => {
		console.info(message);
	});

	return i;
}

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
				const message = consoleText.replace(/[\r\n].*$/, "");
				$container.set({
					...$container.get(),
					consoleProcess: command,
					consoleOutput: message,
				});
			}
		},
	});
}

async function runEmbedInternal(projectId: string, projectZipUrl: string) {
	$container.set({
		...$container.get(),
		loading: "download",
	});

	const i = await createWebContainer();
	await i.fs.rm("/*", { force: true, recursive: true });

	const projectBuffer = await fetch(projectZipUrl).then((r) => r.arrayBuffer());
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

	$container.set({
		...$container.get(),
		loading: "install",
	});

	console.log("npm install...");
	const installProcess = await i.spawn("npm", ["install"], {
		env: { TERM: "plain" },
	});
	installProcess.output.pipeTo(createConsoleStream("npm install"));
	if ((await installProcess.exit) !== 0) {
		throw new Error("Unable to run npm install");
	}

	$container.set({
		...$container.get(),
		loading: "start",
	});

	let script = "start";
	if ("package.json" in contents) {
		const packageJson = JSON.parse(
			new TextDecoder().decode(contents["package.json"]),
		);
		script =
			["dev", "watch", "preview", "start", "server", "serve"].find(
				(name) => name in packageJson.scripts,
			) ?? script;
	}

	console.log(`npm run ${script}...`);
	currentProcess = await i.spawn("npm", ["run", script]);
	currentProcess?.output.pipeTo(createConsoleStream(`npm run ${script}`));

	const exitCode = await currentProcess?.exit;
	if (exitCode != 0 && $container.get().projectId === projectId)
		throw new Error(`npm run ${script}: Exited with ${exitCode}`);
}

export async function runEmbed(projectId: string, projectZipUrl: string) {
	const state = $container.get();

	if (state.projectId === projectId) {
		// If the embed is already active, do nothing
		return;
	}

	if (currentProcess) {
		// If a different embed is active, stop it and replace with this one
		currentProcess?.kill();
		currentProcess = undefined;
	}

	$container.set({
		projectId,
	});

	try {
		await runEmbedInternal(projectId, projectZipUrl);
	} catch (e) {
		console.error(e);

		// If an error is thrown, catch it and set error=true
		$container.set({
			...$container.get(),
			error: true,
		});
	}
}
