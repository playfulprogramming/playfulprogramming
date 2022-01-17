import { unified } from "unified";
import remarkParse from "remark-parse";
import stripMarkdown from "strip-markdown";
import remarkStringify from "remark-stringify";

// Shorten the length but don't cut a word
function shorten(str: string, maxLen: number, separator: string = " ") {
  if (str.length <= maxLen) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLen));
}

export const getExcerpt = (contents: string) => {
  let excerpt = contents.slice(0, 300);
  excerpt = unified()
    .use(remarkParse)
    .use(stripMarkdown, {
      remove: ["heading"],
    })
    .use(remarkStringify)
    .processSync(excerpt).value as string;
  excerpt = excerpt.replace(/\n+/g, " ");
  excerpt = shorten(excerpt, 160);
  if (contents.length > 150) {
    excerpt += "...";
  }
  return excerpt;
};
