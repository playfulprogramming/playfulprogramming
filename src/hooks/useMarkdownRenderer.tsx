import * as React from "react";
import {unified} from "unified";
import rehypeParse from "rehype-parse";
import reactRehyped from "rehype-react";
import {ReactElement, ReactNode} from "react";
import {getHeadings, getMedia, getLinks} from "./MarkdownRenderer";
import {useMarkdownRendererProps} from "./MarkdownRenderer/types";

const getComponents = (props: useMarkdownRendererProps) => {
    return ({

        // Temp fix to remove HTML, BODY, and HEAD nodes from render. Not sure why,
        // but it's being added to the markdown rendering in the `useMarkdownRenderer`
        // step.
        html: ({children}: { children: ReactNode[] }) => <>{children}</>,
        body: ({children}: { children: ReactNode[] }) => <>{children}</>,
        head: ({children}: { children: ReactNode[] }) => <>{children}</>,
        ...getHeadings(props),
        ...getMedia(props),
        ...getLinks(props)
    });
}

export const useMarkdownRenderer = (props: useMarkdownRendererProps) => {
    // This only parses once to avoid serialization errors.
    // DO NOT ADD OTHER REHYPE PLUGINS OR REMARK PLUGINS HERE
    // This works in SRR just fine
    return React.useMemo(() =>
            unified()
                .use(rehypeParse)
                .use(reactRehyped, {
                    createElement: React.createElement,
                    components: getComponents(props) as any,
                }).processSync(props.markdownHTML).result as ReactElement,
        [props]
    );
}
