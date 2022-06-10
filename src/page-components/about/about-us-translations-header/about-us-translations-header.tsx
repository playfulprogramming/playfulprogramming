import styles from "./about-us-translations-header.module.scss";
import Link from "next/link";
import { Languages } from "types/index";
import { Fragment, useMemo } from "react";

interface TranslationsHeaderProps {
  translations: Partial<Record<Languages, string>>;
  lang: Languages;
}
export const AboutUsTranslationsHeader = ({
  translations,
  lang,
}: TranslationsHeaderProps) => {
  const languagesArr = useMemo(() => {
    const langArr = Object.keys(translations) as Languages[];
    return langArr.filter((l) => l !== lang);
  }, [lang, translations]);

  if (!languagesArr.length) return null;

  return (
    <div className={styles.translationContainer}>
      Translated by our community into:{" "}
      {languagesArr.map((currLang, i, arr) => {
        return (
          <Fragment key={currLang}>
            <Link passHref href={`/about/`} locale={currLang}>
              <a>{translations[currLang]}</a>
            </Link>
            {i !== arr.length - 1 ? <span>, </span> : null}
          </Fragment>
        );
      })}
    </div>
  );
};
