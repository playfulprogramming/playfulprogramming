import lunr from "lunr";
import { objectFilter, objectMap } from "ts-util-helpers";
import { ListViewPosts } from "../../api";

type ListViewPost = ListViewPosts[number];

function filterObjByFields<T extends { slug: string }>(
  obj: T,
  fields: Array<{ name: string }>
): ListViewPost & { id: string } {
  const newObj = objectFilter(obj, (val, key) => {
    return !!fields.find((field) => field.name === key);
  });

  (newObj as any).id = newObj.slug;

  return newObj as never;
}

export const createIndex = (
  posts: ListViewPosts,
  lunrFields: Array<{
    name: keyof ListViewPosts[number];
    store?: boolean;
    attributes?: object;
  }>
) => {
  const store: Record<string, ListViewPost> = {};

  const storeFields = lunrFields.filter((f) => f.store === true);

  const index = lunr(function () {
    this.ref("id");
    lunrFields.forEach(({ name, attributes = {} }) => {
      this.field(name, attributes);
    });

    posts.forEach((post) => {
      const newPost = objectMap(post, (val) => {
        if (Array.isArray(val)) val = val.join(",");
        return val;
      });

      const lunrFilteredObj = filterObjByFields(newPost as never, lunrFields);
      const storeFilteredObj = filterObjByFields(newPost as never, storeFields);

      this.add({ ...lunrFilteredObj, id: lunrFilteredObj.slug });
      store[storeFilteredObj.id] = storeFilteredObj;
    });
  });

  return { index, store };
};
