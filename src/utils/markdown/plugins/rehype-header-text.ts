import { headingRank } from "hast-util-heading-rank";
import { hasProperty } from "hast-util-has-property";
import { toString } from "hast-util-to-string";
import { Root, Parent } from "hast";
import {visit} from "unist-util-visit";

/**
 * Plugin to add `data-header-text`s to headings.
 */
export const rehypeHeaderText = () => {
    return (tree: Root, file) => {
      visit(tree, "element", (node: Parent["children"][number]) => {
        if (
          headingRank(node) &&
          "properties" in node &&
          node.properties &&
          !hasProperty(node, "data-header-text")
        ) {
          const headerText = toString(node);
          node.properties["data-header-text"] = headerText;

          const headingWithID = {
            value: headerText,
            depth: headingRank(node)!,
            slug: node.properties["id"] as string,
          };

          if (file.data.astro.frontmatter.headingsWithId) {
            file.data.astro.frontmatter.headingsWithId.push(headingWithID)
          } else {
            file.data.astro.frontmatter.headingsWithId = [headingWithID];
          }
        }
      });
    };
  };
