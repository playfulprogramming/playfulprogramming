import * as Preact from 'preact';
import { useMarkdownRenderer } from 'utils/markdown/useMarkdownRenderer';

export const PostBody = ({markdownHTML, slug}: {markdownHTML: string, slug: string}) => {
    const result = useMarkdownRenderer({
        markdownHTML,
        serverPath: ["/posts", slug],
    });

    return <>{result}</>
}