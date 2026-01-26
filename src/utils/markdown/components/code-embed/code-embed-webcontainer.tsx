import { useEffect, useState } from "preact/hooks";
import { $container, runEmbed } from "./webcontainer-script";
import { useStore } from "@nanostores/preact";

export function CodeEmbedWebcontainer() {
	const container = useStore($container);
	const [processUrl, setProcessUrl] = useState<string>();

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const projectId = params.get("projectId")!;
		const projectZipUrl = params.get("projectZipUrl")!;
		runEmbed(projectId, projectZipUrl);
	}, []);

	useEffect(() => {
		setProcessUrl(container.processUrl);
	}, [container.processUrl]);

	return <iframe src={processUrl} />;
}
