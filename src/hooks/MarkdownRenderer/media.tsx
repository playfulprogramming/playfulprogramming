import * as React from "react";
import {useMarkdownRendererProps} from "./types";
import Image, {ImageProps} from "next/image";
import Zoom from "react-medium-image-zoom";
import {getFullRelativePath} from "../../utils/url-paths";

export const getMedia = ({slug}: useMarkdownRendererProps) => {
    return {
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
        }
    }
}
