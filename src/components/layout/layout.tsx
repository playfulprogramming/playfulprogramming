import * as React from "react";
import Link from "next/link";
import layoutStyles from "./layout.module.scss";
import BackIcon from "assets/icons/back.svg";
import { DarkLightButton } from "../dark-light-button";
import { ThemeProvider } from "constants/theme-context";
import { basePath } from "../../../next.config";
import "../../global.scss";

interface LayoutProps {
  location: Location;
}
export const Layout: React.FC<LayoutProps> = ({ location, children }) => {
  const rootPath = `${basePath}/`;

  const isBase = location.pathname === rootPath;
  const isBlogPost = location.pathname.startsWith(`${rootPath}posts`);

  return (
    <ThemeProvider>
      <div className={layoutStyles.horizCenter}>
        <header
          className={layoutStyles.header}
          aria-label={"Toolbar for primary action buttons"}
        >
          {!isBase && (
            <Link href={`/`}>
              <a
                className={`${layoutStyles.backBtn} baseBtn`}
                aria-label="Go back"
              >
                <BackIcon />
              </a>
            </Link>
          )}
          <DarkLightButton />
        </header>
        <div className={!isBlogPost ? "listViewContent" : "postViewContent"}>
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
};
