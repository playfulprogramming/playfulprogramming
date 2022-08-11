import { Root } from "hast";
import { Plugin } from "unified";
import {getSuggestedArticles} from "../get-suggested-articles";

interface RehypeUnicornGetSuggestedPostsProps {
}

export const rehypeUnicornGetSuggestedPosts: Plugin<
  [RehypeUnicornGetSuggestedPostsProps | never],
  Root
> = () => {
  return (_, file) => {
    function setData(key: string, val: any) {
      (file.data.astro as any).frontmatter[key] = val;
    }

    const post = {
      ...(file.data.astro as any).frontmatter.frontmatterBackup,
      ...(file.data.astro as any).frontmatter
    }

    const suggestedArticles = getSuggestedArticles(post, 'en');
    setData("suggestedArticles", suggestedArticles);
  };
};
