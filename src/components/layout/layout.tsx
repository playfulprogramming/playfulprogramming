import * as React from "react";
import layoutStyles from "./layout.module.scss";
import BackIcon from "assets/icons/back.svg";
import { DarkLightButton } from "../dark-light-button";
import { ThemeProvider } from "constants/theme-context";
import { useRouter } from "next/router";
import { AnalyticsLink } from "components/analytics-link";
import DiscordIcon from "assets/icons/discord.svg";
import { useHistory } from "constants/history-context";

export const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  const { back } = useHistory();

  const rootPath = `${router.basePath}/`;

  const isBase = router.pathname === rootPath;
  const isBlogPost = router.pathname.startsWith(`${rootPath}posts`);
  const isCollection = router.pathname.startsWith(`${rootPath}collections`);

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
                onClick={() => {
                  back("/");
                }}
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
                aria-label={"Join the Discord"}
              >
                <DiscordIcon />
              </AnalyticsLink>
              <DarkLightButton />
            </div>
          </div>
        </header>
        <div
          className={
            isCollection
              ? ""
              : !isBlogPost
              ? "listViewContent"
              : "postViewContent"
          }
        >
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
};
