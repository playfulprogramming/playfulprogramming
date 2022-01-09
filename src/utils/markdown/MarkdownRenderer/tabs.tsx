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
  // TODO: use `Children.clone` to pass `index`
  return (
    <li role="tab" className="react-tabs__tab">
      {children}
    </li>
  );
};
Tab.displayName = "Tab";

const TabList: React.FC = ({ children }) => {
  return (
    <ul role="tablist" className="react-tabs__tab-list">
      {children}
    </ul>
  );
};
TabList.displayName = "TabList";

const TabPanel: React.FC = ({ children }) => {
  // TODO: use `Children.clone` to pass `selected`
  return <div role="tabpanel">{children}</div>;
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
