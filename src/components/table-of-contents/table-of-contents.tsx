import * as React from "react";
import { PostInfo } from "../../types";
import * as tableOfContentsStyle from "./table-of-contents.module.scss";
import { RefObject } from "react";
import { useHeadingIntersectionObserver } from "./use-heading-intersection-observer";
import classnames from "classnames";

interface TableOfContentsProps {
	headingsWithId: PostInfo["fields"]["headingsWithId"];
}

export const TableOfContents = ({ headingsWithId }: TableOfContentsProps) => {
	const headingsToDisplay = React.useMemo(
		() =>
			headingsWithId?.length
				? headingsWithId.filter((headingInfo) => headingInfo.depth <= 3)
				: [],
		[headingsWithId]
	);

	const tocListRef = React.createRef<HTMLOListElement>();

	const arrLength = headingsToDisplay.length;
	const [linkRefs, setLinkRefs] = React.useState<RefObject<HTMLLIElement>[]>(
		[]
	);

	React.useEffect(() => {
		// add or remove refs
		setLinkRefs((elRefs) =>
			Array(arrLength)
				.fill(0)
				.map((_, i) => elRefs[i] || React.createRef<HTMLLIElement>())
		);
	}, [arrLength]);

	useHeadingIntersectionObserver({
		tocListRef,
		linkRefs,
		headingsToDisplay,
	});

	return (
		<aside aria-label={"Table of Contents"}>
			<ol
				className={tableOfContentsStyle.tableList}
				role={"list"}
				ref={tocListRef}
			>
				{headingsToDisplay.map((headingInfo, i) => {
					const liClassNames = classnames(tableOfContentsStyle.tocLi, {
						[tableOfContentsStyle.tocH1]: headingInfo.depth === 1,
						[tableOfContentsStyle.tocH2]: headingInfo.depth === 2,
						[tableOfContentsStyle.tocH3]: headingInfo.depth === 3,
					});
					return (
						<li
							key={headingInfo.slug}
							style={{ marginLeft: `${10 * (headingInfo.depth - 1)}px` }}
							ref={linkRefs[i]}
							className={liClassNames}
						>
							<a href={`#${headingInfo.slug}`}>{headingInfo.value}</a>
						</li>
					);
				})}
			</ol>
		</aside>
	);
};
