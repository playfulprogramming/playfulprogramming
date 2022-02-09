import * as React from "react";
import Link from "next/link";
import layoutStyles from "./layout.module.scss";
import BackIcon from "assets/icons/back.svg";
import { DarkLightButton } from "../dark-light-button";
import { ThemeProvider } from "constants/theme-context";
import { useRouter } from "next/router";
import { AnalyticsLink } from "components/analytics-link";
import DiscordIcon from "assets/icons/discord.svg";

export const Layout: React.FC = ({ children }) => {
  const router = useRouter();

  const rootPath = `${router.basePath}/`;

  const isBase = router.pathname === rootPath;
  const isBlogPost = router.pathname.startsWith(`${rootPath}posts`);

  return (
    <ThemeProvider>
      <div className={layoutStyles.horizCenter}>
        <header
          className={layoutStyles.header}
          aria-label={"Toolbar for primary action buttons"}
        >
          <div className={layoutStyles.headerInsideContainer}>
            {!isBase ? (
              <button
                className={`${layoutStyles.backBtn} baseBtn`}
                aria-label="Go back"
                onClick={() => router.back()}
              >
                <BackIcon />
              </button>
            ) : (
              <div />
            )}
            <div className={layoutStyles.iconList}>
              <AnalyticsLink
                category={"outbound"}
                href="https://discord.gg/FMcvc6T"
                className={"baseBtn"}
              >
                <DiscordIcon />
              </AnalyticsLink>
              <DarkLightButton />
            </div>
          </div>
        </header>
        <div className={!isBlogPost ? "listViewContent" : "postViewContent"}>
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
};
