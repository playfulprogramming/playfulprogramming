import {
	AddressBar,
	CodeContainer,
	Container,
	LoadingPlaceholder,
	PreviewContainer,
	PreviewFrame,
	PreviewPlaceholder,
} from "components/code-embed/code-embed";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import { $container, runEmbed } from "./webcontainer-script";

export interface CodeEmbedProps {
	project: string;
	title: string;
	file: string;
	codeHtml?: string;
	editUrl?: string;
}

export function CodeEmbed(props: CodeEmbedProps) {
	const [address, setAddress] = useState("http://localhost");
	const container = useStore($container);
	const isCurrent = container.projectId == props.project;

	const handleRunEmbed = useCallback(() => {
		runEmbed(props.project, `/generated/projects/${props.project}.zip`);
	}, [props.project]);

	return (
		<Container title={props.title} editUrl={props.editUrl}>
			<CodeContainer>
				<div dangerouslySetInnerHTML={{ __html: props.codeHtml ?? "" }} />
			</CodeContainer>
			<PreviewContainer>
				<AddressBar
					value={address}
					onChange={(value) => setAddress(value)}
					onSubmit={() => {}}
					onReload={() => {}}
				/>
				{isCurrent ? (
					container.loading ? (
						<LoadingPlaceholder
							loading={container.loading}
							consoleProcess={container.consoleProcess}
							consoleOutput={container.consoleOutput}
						/>
					) : (
						container.processUrl ? (
							<PreviewFrame src={container.processUrl} />
						) : <span></span>
					)
				) : (
					<PreviewPlaceholder onClick={handleRunEmbed} />
				)}
			</PreviewContainer>
		</Container>
	);
}
