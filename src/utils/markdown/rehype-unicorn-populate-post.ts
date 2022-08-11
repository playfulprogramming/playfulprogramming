import { Root } from "hast";
import { Plugin } from "unified";
import matter from "gray-matter";
import { readFileSync } from "fs";
import * as path from "path";
import { licenses, unicorns } from "../data";

interface RehypeUnicornPopulatePostProps {
}

export const rehypeUnicornPopulatePost: Plugin<
  [RehypeUnicornPopulatePostProps | never],
  Root
> = () => {
  return (_, file) => {

    function setData(key: string, val: any) {
        (file.data.astro as any).frontmatter[key] = val;
    }

    const fileContents = readFileSync(file.path, "utf8");
    const { data: frontmatter } = matter(fileContents);

    const directorySplit = file.path.split(path.sep);

    // This is the folder name, AKA how we generate the slug ID
    const slug = directorySplit.at(-2);

    // Calculate post locale
    // index.md or index.es.md
    const indexName = directorySplit.at(-1);
    const indexSplit = indexName.split('.');
    let locale = indexSplit.at(-2);
    if (locale === 'index') {
        locale = 'en';
    }
        
    // // TODO: Add translations
    // if (fields.translations) {
    //   const langsToQuery: Languages[] = Object.keys(languages).filter(
    //     (l) => l !== lang
    //   ) as never;
    //   pickedData.translations = langsToQuery
    //     .filter((lang) =>
    //       fs.existsSync(resolve(dirname(fullPath), getIndexPath(lang)))
    //     )
    //     .reduce((prev, lang) => {
    //       prev[lang] = languages[lang];
    //       return prev;
    //     }, {} as Record<Languages, string>);
    // }

    // // TODO: Add collection slug
    // if (fields.collectionSlug) {
    //   if (frontmatterData.series) {
    //     pickedData.collectionSlug = collectionsByName.find(
    //       (collection) => collection.associatedSeries === frontmatterData.series
    //     )?.slug;
    //   }
    //   if (!pickedData.collectionSlug) pickedData.collectionSlug = null;
    // }

    const authorsMeta = (frontmatter.authors as string[]).map(
        (author) => unicorns.find((unicorn) => unicorn.id === author)!
      );
    
      let license;
      if (frontmatter.license) {
        license = licenses.find(
          (l) => l.id === frontmatter.license
        );
      }
      if (!license) license = null;
      
      setData('slug', slug);
      setData('locale', locale);
      setData('authorsMeta', authorsMeta);
      setData('license', license);
      setData('frontmatterBackup', frontmatter);
  };
};
