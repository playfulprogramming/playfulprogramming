import {
	AddressBar,
	CodeContainer,
	Container,
	PreviewContainer,
	PreviewFrame,
	PreviewPlaceholder,
} from "components/code-embed/code-embed";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { FileEntry } from "components/code-embed/types";
import { CodeEmbedContent } from "./code-embed-content";
import { modifyProcessUrl, shortenProcessUrl } from "./common";

export interface CodeEmbedProps {
	projectId: string;
	projectZipUrl: string;
	title: string;
	file?: string;
	fileHtml?: string;
	files: Array<FileEntry>;
	editUrl?: string;
}

export function CodeEmbed(props: CodeEmbedProps) {
	const [processUrl, setProcessUrl] = useState(null);
	const [addressUrl, setAddressUrl] = useState("http://localhost/");
	const [frameUrl, setFrameUrl] = useState(addressUrl);
	const [isCurrent, setCurrent] = useState(false);

	const handleRunEmbed = useCallback(() => {
		setCurrent(true);
		// runEmbed(props.projectId, props.projectZipUrl);
	}, [props.projectId, props.projectZipUrl]);

	useEffect(() => {
		if (processUrl != null) {
			const newFrameUrl = modifyProcessUrl(processUrl, addressUrl);
			setAddressUrl(shortenProcessUrl(newFrameUrl));
			setFrameUrl(newFrameUrl);
		}
	}, [processUrl, addressUrl]);

	const handleAddressChange = useCallback(
		(value: string) => setAddressUrl(value),
		[],
	);

	const handleAddressSubmit = useCallback(() => {
		if (processUrl) {
			setFrameUrl(modifyProcessUrl(processUrl, addressUrl));
		}
	}, [processUrl, addressUrl]);

	const handleAddressReset = useCallback(() => {
		if (processUrl) {
			setAddressUrl(shortenProcessUrl(processUrl));
			setFrameUrl(processUrl);
		}
	}, [processUrl]);

	const handleFrameLoad = useCallback((src: string) => {
		setAddressUrl(shortenProcessUrl(src));
	}, []);

	const [selectedFile, setSelectedFile] = useState(props.file);
	const selectedFileContent = props.files.find(
		(file) => file.name == selectedFile,
	);

	const previewFrameSrc = useMemo(
		() =>
			"/embeds/webcontainer" +
			`?projectId=${encodeURIComponent(props.projectId)}` +
			`&projectZipUrl=${encodeURIComponent(props.projectZipUrl)}`,
		[props.projectId, props.projectZipUrl],
	);

	return (
		<Container
			title={props.title}
			editUrl={props.editUrl}
			codePanel={
				<CodeContainer
					entries={props.files}
					file={selectedFile}
					onFileChange={setSelectedFile}
				>
					{selectedFileContent ? (
						<CodeEmbedContent
							code={selectedFileContent.code}
							lang={selectedFileContent.filetype}
							codeHtml={selectedFile == props.file ? props.fileHtml : undefined}
						/>
					) : (
						""
					)}
				</CodeContainer>
			}
			previewPanel={
				<PreviewContainer>
					<AddressBar
						value={addressUrl}
						onChange={handleAddressChange}
						onSubmit={handleAddressSubmit}
						onReload={handleAddressReset}
					/>
					{isCurrent ? (
						<PreviewFrame src={previewFrameSrc} onLoad={handleFrameLoad} />
					) : (
						<PreviewPlaceholder onClick={handleRunEmbed} />
					)}
				</PreviewContainer>
			}
		/>
	);
}
