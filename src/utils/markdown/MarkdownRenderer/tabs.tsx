import * as React from "react";
import { useMarkdownRendererProps } from "./types";

/**
 * <tabs>
 *   <tab>
 *     <tab-header><b>English</b></tab-header>
 *     <tab-content>
 *       <p>Hello!</p>
 *     </tab-content>
 *   </tab>
 *   <!-- ... -->
 * </tabs>
 */
const Tabs: React.FC = ({ children }) => {
  return <>{children}</>;
};
Tabs.displayName = "Tabs";

const Tab: React.FC = ({ children }) => {
  return <>{children}</>;
};
Tab.displayName = "Tab";

const TabHeader: React.FC = ({ children }) => {
  return <>{children}</>;
};
TabHeader.displayName = "TabHeader";

const TabContents: React.FC = ({ children }) => {
  return <>{children}</>;
};
TabContents.displayName = "TabContents";

export const getTabs = ({ serverPath }: useMarkdownRendererProps) => {
  return {
    tabs: Tabs,
    tab: Tab,
    ["tab-header"]: TabHeader,
    ["tab-contents"]: TabContents,
  };
};
