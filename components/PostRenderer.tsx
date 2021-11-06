import Image, {ImageProps} from "next/image";
import { MDXRemote } from "next-mdx-remote";

// this object will contain all the replacements we want to make
const components = {
    img: (props: ImageProps) => (
        // height and width are part of the props, so they get automatically passed here with {...props}
        <Image {...props} layout="responsive" loading="lazy" />
    ),
};

export function PostRenderer({ post }: { post: string }) {
    return (
        <>
            {/* MDXRemote uses the components prop to decide which html elements to switch for components */}
            <MDXRemote compiledSource={post} components={components} />
        </>
    );
}
