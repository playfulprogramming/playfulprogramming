import React from 'react';
import { useMarkdownRenderer } from 'utils/markdown/useMarkdownRenderer';

export const PostBody = ({markdownHTML, slug}) => {
    const result = useMarkdownRenderer({
        markdownHTML,
        serverPath: ["/posts", slug],
    });

    return <>{result}</>
}
