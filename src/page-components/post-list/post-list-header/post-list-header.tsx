import React from "react";
import styles from "./post-list-header.module.scss";
import Link from "next/link";
const unicornLogo = require("../../../assets/unicorn_utterances_logo_512.png?size=300");

interface PostListHeaderProps {
  siteDescription: string;
}
export const PostListHeader = ({ siteDescription }: PostListHeaderProps) => {
  return (
    <div
      className={styles.container}
      role="banner"
      aria-label={`Banner for Unicorn Utterances`}
    >
      <div className={styles.headerPic}>
        <img
          loading={"eager"}
          alt={`Unicorn Utterances header image`}
          src={unicornLogo}
        />
      </div>
      <div className={styles.noMgContainer}>
        <h1 className={styles.title}>Unicorn Utterances</h1>
        <div
          className={styles.subheader}
          aria-label={"The site's about snippet"}
        >
          {siteDescription}
          <br />
          <Link href={"/about"}>About Us</Link>
        </div>
      </div>
    </div>
  );
};
