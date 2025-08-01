import {
	AddressBar,
	CodeContainer,
	Container,
	LoadingPlaceholder,
	PreviewContainer,
	PreviewError,
	PreviewFrame,
	PreviewPlaceholder,
} from "components/code-embed/code-embed";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "preact/hooks";
import { useStore } from "@nanostores/preact";
import { $container, runEmbed } from "./webcontainer-script";

// Given the base webcontainer URL, modify it with any changes made in the address bar
function modifyProcessUrl(processUrl: string, addressUrl: string) {
	const newUrl = new URL(addressUrl, "http://localhost");
	const srcUrl = new URL(processUrl);
	srcUrl.pathname = newUrl.pathname;
	srcUrl.search = newUrl.search;
	srcUrl.hash = newUrl.hash;

	return srcUrl.toString();
}

// Given the webcontainer URL, shorten the hostname for display purposes
function shortenProcessUrl(url: string): string {
	const serverUrl = new URL(url);
	serverUrl.hostname = "localhost";
	serverUrl.port = "";
	return serverUrl.toString();
}

export interface CodeEmbedProps {
	projectId: string;
	projectZipUrl: string;
	title: string;
	file: string;
	codeHtml?: string;
	editUrl?: string;
}

export function CodeEmbed(props: CodeEmbedProps) {
	const [addressUrl, setAddressUrl] = useState("http://localhost/");
	const [frameUrl, setFrameUrl] = useState(addressUrl);
	const container = useStore($container);
	const isCurrent = container.projectId == props.projectId;

	const handleRunEmbed = useCallback(() => {
		runEmbed(props.projectId, props.projectZipUrl);
	}, [props.projectId]);

	useEffect(() => {
		if (container.processUrl != null) {
			const newFrameUrl = modifyProcessUrl(container.processUrl, addressUrl);
			setAddressUrl(shortenProcessUrl(newFrameUrl));
			setFrameUrl(newFrameUrl);
		}
	}, [container.processUrl]);

	const handleAddressChange = useCallback(
		(value: string) => setAddressUrl(value),
		[],
	);

	const handleAddressSubmit = useCallback(() => {
		if (container.processUrl) {
			setFrameUrl(modifyProcessUrl(container.processUrl, addressUrl));
		}
	}, [container.processUrl, addressUrl]);

	const handleAddressReset = useCallback(() => {
		if (container.processUrl) {
			setAddressUrl(shortenProcessUrl(container.processUrl));
			setFrameUrl(container.processUrl);
		}
	}, [container.processUrl]);

	const handleFrameLoad = useCallback((src: string) => {
		setAddressUrl(shortenProcessUrl(src));
	}, []);

	return (
		<Container title={props.title} editUrl={props.editUrl}>
			<CodeContainer>
				<div dangerouslySetInnerHTML={{ __html: props.codeHtml ?? "" }} />
			</CodeContainer>
			<PreviewContainer>
				<AddressBar
					value={addressUrl}
					onChange={handleAddressChange}
					onSubmit={handleAddressSubmit}
					onReload={handleAddressReset}
				/>
				{isCurrent ? (
					container.error ? (
						<PreviewError />
					) : container.processUrl && frameUrl != addressUrl ? (
						<PreviewFrame src={frameUrl} onLoad={handleFrameLoad} />
					) : (
						<LoadingPlaceholder
							loading={container.loading}
							consoleProcess={container.consoleProcess}
							consoleOutput={container.consoleOutput}
						/>
					)
				) : (
					<PreviewPlaceholder onClick={handleRunEmbed} />
				)}
			</PreviewContainer>
		</Container>
	);
}
