import * as React from "react";
import { useMarkdownRendererProps } from "./types";
import {
  Tab as ReactTab,
  Tabs as ReactTabs,
  TabList as ReactTabList,
  TabPanel as ReactTabPanel,
} from "react-tabs";
import { ReactElement } from "react";
import { onlyText } from "react-children-utilities";

/**
 * @see https://github.com/reactjs/react-tabs for layout of "HTML" nodes
 */
const Tabs: React.FC = ({ children }) => {
  const tabsHeadingText = React.useMemo(() => {
    const childrenArr = React.Children.toArray(children);
    const tabList = childrenArr.filter(
      (child) => (child as ReactElement).type === ReactTabList
    )[0];
    // A list of Tabs
    const tabsCompList = (tabList as ReactElement).props.children;
    const tabTextArr = tabsCompList.map((tabComp: ReactElement) => {
      // Contents of tab header
      return onlyText(tabComp.props.children);
    });
    return tabTextArr;
  }, [children]);
  return <ReactTabs>{children}</ReactTabs>;
};
Tabs.displayName = "Tabs";

export const getTabs = ({ serverPath }: useMarkdownRendererProps) => {
  return {
    tabs: Tabs,
    tab: ReactTab,
    ["tab-list"]: ReactTabList,
    ["tab-panel"]: ReactTabPanel,
  };
};
