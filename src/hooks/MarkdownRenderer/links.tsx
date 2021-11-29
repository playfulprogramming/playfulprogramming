import * as React from "react";
import {useMarkdownRendererProps} from "./types";
import {isRelativePath} from "../../utils/url-paths";
import Link from 'next/link'

export const getLinks = ({slug}: useMarkdownRendererProps) => {
    return {
        a(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
            const {href, ...restProps} = props;
            const isInternalLink = isRelativePath(href || '');
            if (!isInternalLink) {
                return <a
                    {...restProps}
                    href={href}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                >{props.children}</a>
            }
            return <Link {...restProps} href={href || ''}><a>{props.children}</a></Link>
        }
    }
}
