import * as React from "react";
import { useMarkdownRendererProps } from "./types";
import {
  Tab as ReactTab,
  Tabs as ReactTabs,
  TabList as ReactTabList,
  TabPanel as ReactTabPanel,
} from "react-tabs";

/**
 * @see https://github.com/reactjs/react-tabs for layout of "HTML" nodes
 */
const Tabs: React.FC = ({ children }) => {
  return <ReactTabs>{children}</ReactTabs>;
};
Tabs.displayName = "Tabs";

const Tab: React.FC = ({ children }) => {
  // TODO: use `Children.clone` to pass `index`
  return <ReactTab>{children}</ReactTab>;
};
Tab.displayName = "Tab";

const TabList: React.FC = ({ children }) => {
  return <ReactTabList>{children}</ReactTabList>;
};
TabList.displayName = "TabList";

export const getTabs = ({ serverPath }: useMarkdownRendererProps) => {
  return {
    tabs: ReactTabs,
    tab: ReactTab,
    ["tab-list"]: ReactTabList,
    ["tab-panel"]: ReactTabPanel,
  };
};
