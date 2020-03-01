import * as React from "react";
import { PostInfo } from "../../types";
import tableOfContentsStyle from "./table-of-contents.module.scss";
import { RefObject } from "react";
import { useHeadingIntersectionObserver } from "./use-heading-intersection-observer";

interface TableOfContentsProps {
	headingsWithId: PostInfo["fields"]["headingsWithId"];
}

export const TableOfContents = ({ headingsWithId }: TableOfContentsProps) => {
	const headingsToDisplay = React.useMemo(
		() => headingsWithId.filter(headingInfo => headingInfo.depth <= 3),
		[headingsWithId]
	);

	const tocListRef = React.createRef<HTMLOListElement>();

	const arrLength = headingsToDisplay.length;
	const [linkRefs, setLinkRefs] = React.useState<RefObject<HTMLLIElement>[]>(
		[]
	);

	React.useEffect(() => {
		// add or remove refs
		setLinkRefs(elRefs =>
			Array(arrLength)
				.fill(0)
				.map((_, i) => elRefs[i] || React.createRef<HTMLLIElement>())
		);
	}, [arrLength]);

	useHeadingIntersectionObserver({
		tocListRef,
		linkRefs,
		headingsToDisplay
	});

	return (
		<ol
			aria-label={"Table of Contents"}
			className={tableOfContentsStyle.tableList}
			role={"list"}
			ref={tocListRef}
		>
			{headingsToDisplay.map((headingInfo, i) => (
				<li
					key={headingInfo.slug}
					style={{ marginLeft: `${1 * (headingInfo.depth - 1)}rem` }}
					ref={linkRefs[i]}
				>
					<a href={`#${headingInfo.slug}`}>{headingInfo.value}</a>
				</li>
			))}
		</ol>
	);
};
