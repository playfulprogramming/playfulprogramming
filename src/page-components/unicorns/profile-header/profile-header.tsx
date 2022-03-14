import React, { useMemo } from "react";
import styles from "./profile-header.module.scss";
import Image from "next/image";
import GitHubIcon from "assets/icons/github.svg";
import SiteIcon from "assets/icons/site.svg";
import LinkedInIcon from "assets/icons/linkedin.svg";
import TwitterIcon from "assets/icons/twitter.svg";
import TwitchIcon from "assets/icons/twitch.svg";
import DribbbleIcon from "assets/icons/dribbble.svg";
import { UnicornInfo } from "uu-types";
import { AnalyticsLink } from "components/analytics-link";

const getNamePossessive = (name: string) => {
  if (name.endsWith("s")) return `${name}'`;
  return `${name}'s`;
};

interface SocialBtnProps {
  icon: React.ReactNode;
  text: string;
  url: string;
}
const SocialBtn = ({ icon, text, url }: SocialBtnProps) => {
  return (
    <li className={`baseBtn ${styles.socialBtnLink}`} role="listitem">
      <AnalyticsLink
        category="outbound"
        className="unlink"
        target="_blank"
        rel="noreferrer"
        href={url}
      >
        <span className={styles.svgContainer} aria-hidden={true}>
          {icon}
        </span>
        <span className={styles.socialText}>{text}</span>
      </AnalyticsLink>
    </li>
  );
};

interface PicTitleHeaderProps {
  unicornData: UnicornInfo;
}
export const ProfileHeader = ({ unicornData }: PicTitleHeaderProps) => {
  const possessiveName = useMemo(
    () => getNamePossessive(unicornData.name),
    [unicornData]
  );

  return (
    <div
      className={styles.container}
      role="banner"
      aria-label={`Banner for ${unicornData.name}`}
    >
      <div
        className={styles.headerPic}
        style={{
          height: "300px",
          width: "300px",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <Image
          src={unicornData.profileImg.relativeServerPath}
          height={unicornData.profileImg.height}
          width={unicornData.profileImg.width}
          sizes={"300px"}
          layout="responsive"
          loading={"eager"}
          priority={true}
          alt={`${possessiveName} profile picture`}
        />
      </div>
      <div className={styles.noMgContainer}>
        <h1 className={`${styles.title} ${styles.mobileTitle}`}>
          {unicornData.name}
        </h1>
        <h1 className={`${styles.title} ${styles.desktopTitle}`}>
          {unicornData.name}
        </h1>
        <div
          className={styles.subheader}
          aria-label={`A description of ${unicornData.name}`}
        >
          {unicornData.description}
        </div>
        {unicornData.socials && (
          <ul
            className={styles.socialsContainer}
            aria-label={`${possessiveName} social media links`}
            role="list"
          >
            {unicornData.socials.twitter && (
              <SocialBtn
                icon={<TwitterIcon />}
                text={"Twitter"}
                url={`https://twitter.com/${unicornData.socials.twitter}`}
              />
            )}
            {unicornData.socials.github && (
              <SocialBtn
                icon={<GitHubIcon />}
                text={"GitHub"}
                url={`https://github.com/${unicornData.socials.github}`}
              />
            )}
            {unicornData.socials.linkedIn && (
              <SocialBtn
                icon={<LinkedInIcon />}
                text={"LinkedIn"}
                url={`https://www.linkedin.com/in/${unicornData.socials.linkedIn}`}
              />
            )}
            {unicornData.socials.twitch && (
              <SocialBtn
                icon={<TwitchIcon />}
                text={"Twitch"}
                url={`https://twitch.tv/${unicornData.socials.twitch}`}
              />
            )}
            {unicornData.socials.dribbble && (
              <SocialBtn
                icon={<DribbbleIcon />}
                text={"Dribbble"}
                url={`https://dribbble.com/${unicornData.socials.dribbble}`}
              />
            )}
            {unicornData.socials.website && (
              <SocialBtn
                icon={<SiteIcon />}
                text={"Website"}
                url={unicornData.socials.website}
              />
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
