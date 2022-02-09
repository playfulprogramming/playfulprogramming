import { Root } from "hast";
import replaceAllBetween from "unist-util-replace-all-between";

/**
 * Plugin to add Docsify's tab support.
 * @see https://jhildenbiddle.github.io/docsify-tabs/
 *
 * Given that syntax, output the following:
 * ```
 * <tabs>
 *  <tab-list>
 *    <tab>Header Contents</tab>
 *  </tab-list>
 *  <tab-panel>Body contents</tab-panel>
 * </tabs>
 * ```
 *
 * To align with React Tabs package:
 * @see https://github.com/reactjs/react-tabs
 */
export const rehypeTabs = () => {
  return (tree: Root) => {
    replaceAllBetween(
      tree,
      { type: "raw", value: "<!-- tabs:start -->" } as never,
      { type: "raw", value: "<!-- tabs:end -->" } as never,
      (nodes) => {
        let sections = [];
        let sectionStarted = false;
        let isNodeHeading = (n: any) =>
          n.type === "element" && /h[1-6]/.exec(n.tagName);

        const tabsContainer = {
          type: "element",
          tagName: "tabs",
          children: [
            {
              type: "element",
              tagName: "tab-list",
              children: [] as any[],
            },
          ],
        };

        for (const localNode of nodes as any[]) {
          if (!sectionStarted && !isNodeHeading(localNode)) continue;
          sectionStarted = true;

          if (isNodeHeading(localNode)) {
            const header = {
              type: "element",
              tagName: "tab",
              children: localNode.children,
            };

            const contents = {
              type: "element",
              tagName: "tab-panel",
              children: [],
            };

            tabsContainer.children[0].children.push(header);

            tabsContainer.children.push(contents);
            continue;
          }

          // Push into last `tab-panel`
          tabsContainer.children[
            tabsContainer.children.length - 1
          ].children.push(localNode);
        }

        return [tabsContainer];
      }
    );
    return tree;
  };
};
