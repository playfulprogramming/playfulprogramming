import * as React from "react";
import {unified} from "unified";
import rehypeParse from "rehype-parse";
import reactRehyped from "rehype-react";
import Image, {ImageProps} from "next/image";
import {join} from "path";
import {ReactElement} from "react";

interface useMarkdownRendererProps {
    postsDirectory: string;
    slug: string;
    markdownHTML: string
}

const getComponents = ({
                           postsDirectory,
                           slug
                       }: useMarkdownRendererProps) => ({
    img: (imgProps: unknown) => {
        const {src, ...props2} = imgProps as ImageProps;
        const imagePath = join(postsDirectory, slug, src as string);
        const beResponsive = props2.height && props2.width;
        return (
            <Image
                src={imagePath}
                {...props2}
                layout={beResponsive ? "responsive" : "fill"}
                loading="lazy"
            />
        )
    }
})

export const useMarkdownRenderer = (props: useMarkdownRendererProps) => {
    // This only parses once to avoid serialization errors.
    // DO NOT ADD OTHER REHYPE PLUGINS OR REMARK PLUGINS HERE
    // This works in SRR just fine
    return React.useMemo(() =>
        unified()
        .use(rehypeParse)
        .use(reactRehyped, {
            createElement: React.createElement,
            components: getComponents(props)
        }).processSync(props.markdownHTML).result as ReactElement,
        [props]
    );
}
