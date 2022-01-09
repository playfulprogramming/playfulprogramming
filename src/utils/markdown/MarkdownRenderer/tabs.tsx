import * as React from "react";
import { useMarkdownRendererProps } from "./types";

/**
 * @see https://github.com/reactjs/react-tabs for layout of "HTML" nodes
 */
const Tabs: React.FC = ({ children }) => {
  return <>{children}</>;
};
Tabs.displayName = "Tabs";

const Tab: React.FC = ({ children }) => {
  return <>{children}</>;
};
Tab.displayName = "Tab";

const TabList: React.FC = ({ children }) => {
  return <>{children}</>;
};
TabList.displayName = "TabList";

const TabPanel: React.FC = ({ children }) => {
  return <>{children}</>;
};
TabPanel.displayName = "TabPanel";

export const getTabs = ({ serverPath }: useMarkdownRendererProps) => {
  return {
    tabs: Tabs,
    tab: Tab,
    ["tab-list"]: TabList,
    ["tab-panel"]: TabPanel,
  };
};
