import lunr from "lunr";
import { getAllPostsForListView, ListViewPosts } from "utils/fs/api";
import { objectFilter } from "ts-util-helpers";
import path from "path";
import * as fs from "fs";

type ListViewPost = ListViewPosts[number];

let indexCache: null | { index: lunr.Index; store: Record<string, any> } = null;

export const createIndex = (
  posts: ListViewPosts,
  lunrFields: Array<{
    name: keyof ListViewPost;
    store?: boolean;
    attributes?: object;
    resolver?: (obj: ListViewPost) => string | number;
  }>
) => {
  if (indexCache) return indexCache;
  // TODO: Strictly type to only what `store: true` includes
  const store: Record<string, any> = {};

  const storeFields = lunrFields.filter((f) => f.store === true);

  const index = lunr(function () {
    this.ref("id");
    lunrFields.forEach(({ name, attributes = {} }) => {
      this.field(name, attributes);
    });

    posts.forEach((post) => {
      const newPost: Partial<Record<keyof ListViewPost, any>> & { id: string } =
        { id: post.slug };
      for (let field of lunrFields) {
        if (field.resolver) {
          newPost[field.name] = field.resolver(post);
          continue;
        }
        const postFieldVal = post[field.name];
        newPost[field.name] = Array.isArray(postFieldVal)
          ? postFieldVal.join(" ")
          : postFieldVal;
      }

      const storeFilteredObj = objectFilter(newPost, (_, key) => {
        return (
          key === "id" ||
          !!storeFields.find((storeField) => storeField.name === key)
        );
      });

      this.add(newPost);
      store[storeFilteredObj.id!] = storeFilteredObj;
    });
  });

  indexCache = { index, store };

  return indexCache;
};

const exportedIndex = createIndex(getAllPostsForListView("en"), [
  {
    name: "title",
    store: true,
    attributes: { boost: 20 },
  },
  { name: "excerpt", resolver: (post) => post.description || post.excerpt },
  {
    name: "slug",
    store: true,
  },
  { name: "authors" },
  { name: "tags", store: true },
]);

fs.writeFileSync(
  path.resolve(process.cwd(), "./public/search_index.json"),
  JSON.stringify(exportedIndex)
);
