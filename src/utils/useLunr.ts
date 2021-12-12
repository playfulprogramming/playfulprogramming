import { useEffect, useRef, useState } from "react";
import { getNewIndex } from "constants/search";
import { ListViewPosts } from "../api";

interface LunrProps {
  exportedIndex: Record<number | string, string>;
  posts: ListViewPosts;
}

/**
 *
 * @param [language]
 * @returns {object}
 * results - an array of matches {slug: string}[]
 * onSearch - A `onChange` event or a callback to pass a string
 */
export const useLunr = ({ exportedIndex, posts }: LunrProps) => {
  const [results, setResults] = useState<any[] | null>(null);
  const indexRef = useRef(getNewIndex());

  useEffect(() => {
    if (!exportedIndex) {
      return;
    }
    const keys = Object.keys(exportedIndex);

    keys.forEach((key) => {
      indexRef.current.import(key, exportedIndex[key]);
    });
  }, [exportedIndex]);

  const searchUsingLunr = (str: string) => {
    const ids = indexRef.current.search(str);
    if (!ids.length) {
      setResults(null);
      return;
    }
    const results = posts.filter((post) => ids.includes(post.slug));
    setResults(results);
  };

  return { searchUsingLunr, results };
};
