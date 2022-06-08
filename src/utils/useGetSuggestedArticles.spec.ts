import { getSuggestedArticles } from "utils/useGetSuggestedArticles";

jest.mock("utils/fs/api", () => {
  const seriesPost1 = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: 1,
    series: "Test",
    slug: "/series-1",
    tags: ["series"],
    published: "10/10/1010",
    title: "Series Post 1",
  };

  const seriesPost2 = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: 2,
    series: "Test",
    slug: "/series-2",
    tags: ["series"],
    published: "10/10/1011",
    title: "Series Post 2",
  };

  const seriesPost3 = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: 3,
    series: "Test",
    slug: "/series-3",
    tags: ["series"],
    published: "10/10/1012",
    title: "Series Post 3",
  };

  const seriesPost4 = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: 4,
    series: "Test",
    slug: "/series-4",
    tags: ["series"],
    published: "10/10/1013",
    title: "Series Post 4",
  };

  const seriesPost5 = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: 5,
    series: "Test",
    slug: "/series-5",
    tags: ["series"],
    published: "10/10/1013",
    title: "Series Post 5",
  };

  const angularReactVueSveltePost = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: undefined,
    series: undefined,
    slug: "/react-angular-vue-svelte",
    tags: ["react", "angular", "vue", "svelte"],
    published: "10/10/1010",
    title: "Angular React Vue Svelte",
  };

  const angularReactVuePost = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: undefined,
    series: undefined,
    slug: "/react-angular-vue",
    tags: ["react", "angular", "vue"],
    published: "10/10/1010",
    title: "Angular React Vue",
  };

  const angularReactPost = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: undefined,
    series: undefined,
    slug: "/react-angular",
    tags: ["react", "angular"],
    published: "10/10/1010",
    title: "Angular React",
  };

  const angularPost = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: undefined,
    series: undefined,
    slug: "/angular",
    tags: ["angular"],
    published: "10/10/1010",
    title: "Angular",
  };

  const noSimilarPosts = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: undefined,
    series: undefined,
    slug: "/no-similar-posts",
    tags: ["nothingheretosee"],
    published: "10/10/1010",
    title: "No Similar Post",
  };

  const newestPost = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: undefined,
    series: undefined,
    slug: "/newest-post-1",
    tags: ["webdev"],
    published: "10/10/3000",
    title: "Newest Post 1",
  };

  const secondNewestPost = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: undefined,
    series: undefined,
    slug: "/newest-post-2",
    tags: ["webdev"],
    published: "10/10/2999",
    title: "Newest Post 2",
  };

  const thirdNewestPost = {
    authors: [
      {
        name: "Corbin",
      },
    ],
    order: undefined,
    series: undefined,
    slug: "/newest-post-3",
    tags: ["webdev"],
    published: "10/10/2998",
    title: "Newest Post 3",
  };

  const fsAPI = jest.requireActual("utils/fs/api");
  return {
    ...fsAPI,
    seriesPost1,
    seriesPost2,
    seriesPost3,
    seriesPost4,
    seriesPost5,
    angularReactVueSveltePost,
    angularReactVuePost,
    angularReactPost,
    angularPost,
    noSimilarPosts,
    newestPost,
    secondNewestPost,
    thirdNewestPost,
    getAllPosts() {
      return [
        seriesPost1,
        seriesPost2,
        seriesPost3,
        seriesPost4,
        seriesPost5,
        angularReactVueSveltePost,
        angularReactVuePost,
        angularReactPost,
        angularPost,
        noSimilarPosts,
        newestPost,
        secondNewestPost,
        thirdNewestPost,
      ];
    },
  };
});

const {
  seriesPost1,
  seriesPost2,
  seriesPost3,
  seriesPost4,
  angularReactVueSveltePost,
  angularReactVuePost,
  angularReactPost,
  angularPost,
  noSimilarPosts,
  newestPost,
  secondNewestPost,
  thirdNewestPost,
} = require("utils/fs/api");

test("should suggest series articles starting with 1", () => {
  const suggestedArticles = getSuggestedArticles(seriesPost1 as any, "en");
  expect(suggestedArticles[0].slug).toBe(seriesPost2.slug);
  expect(suggestedArticles[1].slug).toBe(seriesPost3.slug);
  expect(suggestedArticles[2].slug).toBe(seriesPost4.slug);
});

test("should suggest series articles starting with 2", () => {
  const suggestedArticles = getSuggestedArticles(seriesPost2 as any, "en");
  expect(suggestedArticles[0].slug).toBe(seriesPost1.slug);
  expect(suggestedArticles[1].slug).toBe(seriesPost3.slug);
  expect(suggestedArticles[2].slug).toBe(seriesPost4.slug);
});

test("recommend other similar tagged posts", () => {
  const suggestedArticles = getSuggestedArticles(
    angularReactVueSveltePost as any,
    "en"
  );
  expect(suggestedArticles[0].slug).toBe(angularReactVuePost.slug);
  expect(suggestedArticles[1].slug).toBe(angularReactPost.slug);
  expect(suggestedArticles[2].slug).toBe(angularPost.slug);
});

test("no similar tags recommends latest articles", () => {
  const suggestedArticles = getSuggestedArticles(noSimilarPosts as any, "en");
  expect(suggestedArticles[0].slug).toBe(newestPost.slug);
  expect(suggestedArticles[1].slug).toBe(secondNewestPost.slug);
  expect(suggestedArticles[2].slug).toBe(thirdNewestPost.slug);
});
