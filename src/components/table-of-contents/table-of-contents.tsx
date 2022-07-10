import * as React from "react";
import tableOfContentsStyle from "./table-of-contents.module.scss";
import { RenderedPostInfo } from "uu-types";
import { RefObject } from "react";
import { useHeadingIntersectionObserver } from "./use-heading-intersection-observer";
import classnames from "classnames";

interface TableOfContentsProps {
  headingsWithId: RenderedPostInfo["headingsWithId"];
}

export const TableOfContents = ({ headingsWithId }: TableOfContentsProps) => {
  const headingsToDisplay = React.useMemo(() => {
    const headings = headingsWithId?.length
      ? headingsWithId.filter((headingInfo) => headingInfo.depth <= 3)
      : [];

    // get the "minimum" depth of heading used in the post (e.g. if the post only uses h2 and h3 -> minDepth=1)
    const minDepth = Math.min(...headings.map((h) => h.depth));

    // offset the heading depths by minDepth, so they always start at 1
    return headings.map((h) =>
      Object.assign({}, h, { depth: h.depth - minDepth + 1 })
    );
  }, [headingsWithId]);

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
