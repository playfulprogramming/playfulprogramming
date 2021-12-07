import * as React from "react";
import layoutStyles from "./blog-post-layout.module.scss";

interface LayoutProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  center: React.ReactNode;
}
export const BlogPostLayout = ({
  left = null,
  right = null,
  center,
}: LayoutProps) => {
  return (
    <div className={layoutStyles.blogPostLayoutContainer}>
      <div className={layoutStyles.leftContainer}>{left}</div>
      <div className={layoutStyles.centerContainer}>{center}</div>
      <div className={layoutStyles.rightContainer}>{right}</div>
    </div>
  );
};
