import * as React from "react";
import { PostInfo } from "../../types";
import tableOfContentsStyle from "./table-of-contents.module.scss";

interface TableOfContentsProps {
	headingsWithId: PostInfo["fields"]["headingsWithId"];
}

export const TableOfContents = ({ headingsWithId }: TableOfContentsProps) => {
	// React.useEffect(() => {
	// 	window.scrollTo(3000, 3000)
	// }, []);

	return (
		<ol
			aria-label={"Table of Contents"}
			className={tableOfContentsStyle.tableList}
			role={"list"}
		>
			{headingsWithId
				.filter(headingInfo => headingInfo.depth <= 3)
				.map(headingInfo => (
					<li
						key={headingInfo.slug}
						style={{ marginLeft: `${1 * (headingInfo.depth - 1)}rem` }}
					>
						<a href={`#${headingInfo.slug}`}>{headingInfo.value}</a>
					</li>
				))}
		</ol>
	);
};
