import { headingRank } from "hast-util-heading-rank";
import { hasProperty } from "hast-util-has-property";
import { toString } from "hast-util-to-string";
import { Root, Parent } from "hast";
import visit from "unist-util-visit";

/**
 * Plugin to add `data-header-text`s to headings.
 */
export const rehypeHeaderText = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Parent["children"][number]) => {
      if (
        headingRank(node) &&
        "properties" in node &&
        node.properties &&
        !hasProperty(node, "data-header-text")
      ) {
        node.properties["data-header-text"] = toString(node);
      }
    });
  };
};
