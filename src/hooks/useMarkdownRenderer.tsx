import * as React from "react";
import {unified} from "unified";
import rehypeParse from "rehype-parse";
import reactRehyped from "rehype-react";
import Image, {ImageProps} from "next/image";
import { ReactElement, ReactNode } from "react";
import Zoom from 'react-medium-image-zoom';
import urljoin from 'url-join';

interface useMarkdownRendererProps {
    postsDirectory: string;
    slug: string;
    markdownHTML: string
}

const isRelativePath = (str: string) => {
    return str.startsWith('./') || /^\w/.exec(str);
}

const getFullRelativePath = (slug: string, srcStr: string) => {
    if (srcStr.startsWith('./')) srcStr = srcStr.slice(2);
    return isRelativePath(srcStr) ?
            // URLJoin doesn't seem to handle the `./` well
            urljoin('/posts', slug, srcStr)
            : srcStr
}

const getComponents = ({
                           slug
                       }: useMarkdownRendererProps) => ({
    img: (imgProps: unknown) => {
        const {src, ...props2} = imgProps as ImageProps;
        let srcStr = getFullRelativePath(slug, src as string); // ImageProps isn't _quite_ right for our usg here

        // only "fill" is supported when height and width are not specified
        const beResponsive = !!(props2.height && props2.width);

        return (
          <Zoom>
            <Image
                src={srcStr}
                {...props2}
                layout={beResponsive ? "intrinsic" : "fill"}
                loading="lazy"
            />
          </Zoom>
        )
    },
    video: (props: React.VideoHTMLAttributes<HTMLVideoElement>) => {
        const {src, ...rest} = props;
        const srcStr = getFullRelativePath(slug, src || '');
        return <video
            muted={true}
            autoPlay={true}
            controls={true}
            loop={true}
            width="100%"
            height="auto"
            {...rest}
            src={srcStr}/>
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
