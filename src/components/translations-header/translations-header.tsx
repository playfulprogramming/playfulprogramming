import styles from "./translations-header.module.scss";
import { RenderedPostInfo } from "types/PostInfo";
import { SlugPostInfo } from "constants/queries";
import Link from "next/link";
import { Languages } from "types/index";

interface TranslationsHeaderProps {
  post: SlugPostInfo & RenderedPostInfo;
}
export const TranslationsHeader = ({ post }: TranslationsHeaderProps) => {
  return (
    <div>
      Translated by readers into:{" "}
      {(Object.keys(post.translations) as Languages[]).map((lang) => {
        const langHref = lang === "en" ? "" : `${lang}/`;
        return (
          <Link key={lang} passHref href={`/posts/${langHref}${post.slug}`}>
            <a>{post.translations[lang]}</a>
          </Link>
        );
      })}
    </div>
  );
};
