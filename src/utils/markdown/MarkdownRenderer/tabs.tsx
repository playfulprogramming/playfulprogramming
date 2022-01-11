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
import { useIsomorphicLayoutEffect } from "react-use";

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
    return tabTextArr as string[];
  }, [children]);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  useIsomorphicLayoutEffect(() => {
    if (!tabsHeadingText?.length) {
      return;
    }
    const tabSelect = localStorage.getItem("tabs-selection");
    if (!tabSelect) return;
    const matchIndex = tabsHeadingText.findIndex(
      (headingText) => tabSelect === headingText
    );
    if (matchIndex === -1) return;
    setSelectedIndex(matchIndex);
  }, [tabsHeadingText]);

  const onSelect = React.useCallback(
    (index: number) => {
      localStorage.setItem("tabs-selection", tabsHeadingText[index]);
      setSelectedIndex(index);
    },
    [tabsHeadingText]
  );

  return (
    <ReactTabs selectedIndex={selectedIndex} onSelect={onSelect}>
      {children}
    </ReactTabs>
  );
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
