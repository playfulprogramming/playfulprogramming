import { useLayoutEffect } from "preact/hooks";

import { useElementSize } from "../../hooks/use-element-size";
import { LongWave } from "../events/components/long-wave/long-wave";
import { EventBlock } from "../events/types";
import { UrlMetadataResponse } from "utils/hoof";
import style from "./book-club.module.scss";
import { EventChip } from "../events/components/event-chip/event-chip";
import { Button, LargeButton } from "components/button/button";

interface EventBlockWithMetadata extends EventBlock {
	location_metadata: UrlMetadataResponse;
}

interface EventsPageProps {
	eventBlocksWithMetadata: EventBlockWithMetadata[];
}

export default function EventsPage({
	eventBlocksWithMetadata,
}: EventsPageProps) {
	/**
	 * Styles for header bar
	 */
	const { size, setEl } = useElementSize();

	useLayoutEffect(() => {
		const header = document.querySelector("#header-bar") as HTMLElement;
		setEl(header);
	}, []);

	const headerHeight = size.height;

	return (
		<div className={style.container}>
			<div
				className={style.titleContainer}
				style={{
					top: headerHeight,
					position: "sticky",
					// this should be overflow: clip; to prevent the browser scrolling within the element when a filter checkbox is focused:
					// https://stackoverflow.com/q/75419337
					// https://github.com/playfulprogramming/playfulprogramming/issues/653
					overflow: "clip",
				}}
			>
				<div className={style.backgroundTop}>
					<div className={style.topText}>
						<h1 className={`text-style-headline-1 ${style.eventsTitle}`}>
							Book Club
							<span className={style.eventChipContainer}>
								<EventChip size={"compact"} variant={"online"} />
							</span>
						</h1>
						<p
							className={`text-style-body-large`}
							style={{ fontStyle: "italic" }}
						>
							In our weekly book club, we hang out and chat about a topic or a
							specific article!
						</p>
					</div>
					<LargeButton
						href={"https://discord.gg/FMcvc6T"}
						variant={"primary-emphasized"}
					>
						Join our Discord
					</LargeButton>
				</div>
				<LongWave />
			</div>
			<div className={style.listsContainer}>
				<p>Testing</p>
			</div>
		</div>
	);
}
