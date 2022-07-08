import { headingRank } from "hast-util-heading-rank";
import { hasProperty } from "hast-util-has-property";
import { toString } from "hast-util-to-string";
import { Root, Parent } from "hast";
import {visit} from "unist-util-visit";
import { RenderedPostInfo } from "types/PostInfo";

/**
 * Plugin to add `data-header-text`s to headings.
 */
export const rehypeHeaderText =
  (post: Pick<RenderedPostInfo, "headingsWithId">) => () => {
    return (tree: Root) => {
      visit(tree, "element", (node: Parent["children"][number]) => {
        if (
          headingRank(node) &&
          "properties" in node &&
          node.properties &&
          !hasProperty(node, "data-header-text")
        ) {
          const headerText = toString(node);
          node.properties["data-header-text"] = headerText;
          post.headingsWithId?.push({
            value: headerText,
            depth: headingRank(node)!,
            slug: node.properties["id"] as string,
          });
        }
      });
    };
  };
