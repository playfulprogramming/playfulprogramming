/**
 * Source ported from a Gatsby plugin:
 * @see https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-google-gtag/src/index.js
 */
import * as ga from "utils/ga";
import { forwardRef, AnchorHTMLAttributes, MouseEventHandler } from "react";

interface OutboundLinkProps {
  onClick?: MouseEventHandler;
  target?: string;
  href: string;
}

export const OutboundLink = forwardRef<
  HTMLAnchorElement,
  OutboundLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>
>(({ children, ...props }, ref) => (
  <a
    ref={ref}
    {...props}
    onClick={(e) => {
      if (typeof props.onClick === `function`) {
        props.onClick(e);
      }
      let redirect = true;
      if (
        e.button !== 0 ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.defaultPrevented
      ) {
        redirect = false;
      }
      if (props.target && props.target.toLowerCase() !== `_self`) {
        redirect = false;
      }
      if (!!window.gtag) {
        ga.event({
          action: "click",
          params: {
            event_category: `outbound`,
            event_label: props.href,
            transport_type: redirect ? `beacon` : ``,
            event_callback: function () {
              if (redirect) {
                document.location = props.href;
              }
            },
          },
        });
      } else {
        if (redirect) {
          document.location = props.href;
        }
      }

      return false;
    }}
  >
    {children}
  </a>
));

OutboundLink.displayName = `OutboundLink`;
