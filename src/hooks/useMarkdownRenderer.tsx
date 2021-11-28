import * as React from "react";
import {unified} from "unified";
import rehypeParse from "rehype-parse";
import reactRehyped from "rehype-react";
import Image, {ImageProps} from "next/image";
import {join, normalize} from "path";
import { ReactElement, ReactNode } from "react";
import Zoom from 'react-medium-image-zoom';
import urljoin from 'url-join';

interface useMarkdownRendererProps {
    postsDirectory: string;
    slug: string;
    markdownHTML: string
}

const getComponents = ({
                           slug
                       }: useMarkdownRendererProps) => ({
    img: (imgProps: unknown) => {
        const {src, ...props2} = imgProps as ImageProps;
        const srcStr = src as string; // ImageProps isn't _quite_ right for our usg here
        const imagePath =
            srcStr.startsWith('./') ?
                // URLJoin doesn't seem to handle the `./` well
                urljoin('/posts', slug, srcStr.slice(2, srcStr.length))
                : srcStr
        
        // only "fill" is supported when height and width are not specified
        const beResponsive = !!(props2.height && props2.width);

        return (
          <Zoom>
            <Image
                src={imagePath}
                {...props2}
                layout={beResponsive ? "intrinsic" : "fill"}
                loading="lazy"
            />
          </Zoom>
        )
    },
    // Temp fix to remove HTML, BODY, and HEAD nodes from render. Not sure why,
    // but it's being added to the markdown rendering in the `useMarkdownRenderer`
    // step.
    html: ({children}: {children: ReactNode[]}) => <>{children}</>,
    body: ({children}: {children: ReactNode[]}) => <>{children}</>,
    head: ({children}: {children: ReactNode[]}) => <>{children}</>,
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
            components: getComponents(props) as any,
        }).processSync(props.markdownHTML).result as ReactElement,
        [props]
    );
}
