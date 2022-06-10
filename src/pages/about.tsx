import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import style from "../page-components/about/about.module.scss";
import { Languages, UnicornInfo } from "uu-types";
import { siteDirectory, sponsorsDirectory, unicorns } from "utils/fs/get-datas";
import unicornLogo from "assets/unicorn_head_1024.png";
import { useRouter } from "next/router";
import { readMarkdownFile } from "utils/fs/api";
import { join, resolve } from "path";
import markdownToHtml from "utils/markdown/markdownToHtml";
import { useMarkdownRenderer } from "utils/markdown/useMarkdownRenderer";
import { SEO } from "components/seo";
import { existsSync } from "fs";
import { languages } from "constants/index";
import { objectFilter } from "ts-util-helpers";
import { AboutUsTranslationsHeader } from "../page-components/about/about-us-translations-header";

const getUnicornRoleListItems = (unicornInfo: UnicornInfo) => {
  const unicornRoles = unicornInfo.roles.slice(0);

  return unicornRoles.map((role, i, arr) => {
    // If there is an item ahead
    const shouldShowComma = arr[i + 1];
    return (
      <li key={role.id} role="listitem">
        {role.prettyname}
        {shouldShowComma && <span aria-hidden={true}>,&nbsp;</span>}
      </li>
    );
  });
};

interface AboutUsProps {
  allUnicorns: UnicornInfo[];
  html: string;
  translations: Partial<Record<Languages, string>>;
  lang: Languages;
}

const AboutUs = ({ allUnicorns, html, translations, lang }: AboutUsProps) => {
  const langData = useMemo(() => {
    const otherLangs = translations
      ? (Object.keys(translations).filter((t) => t !== lang) as Languages[])
      : [];

    return {
      otherLangs,
      currentLang: lang,
    };
  }, [lang, translations]);

  const router = useRouter();

  const result = useMarkdownRenderer({
    markdownHTML: html,
    serverPath: [""],
  });

  return (
    <div>
      <SEO title="About Us" pathName={router.asPath} langData={langData} />
      <div className={style.container}>
        <div className={style.headerTitle}>
          <div className={style.unicornLogo}>
            <Image
              src={unicornLogo}
              loading={"eager"}
              layout="responsive"
              sizes={"192px"}
              alt={"Unicorn Utterances logo"}
            />
          </div>
          <h1>About Us</h1>
        </div>
        <main className={`${style.aboutBody} post-body`}>
          <AboutUsTranslationsHeader translations={translations} lang={lang} />
          <div>{result}</div>
          {allUnicorns.map((unicornInfo) => {
            const roleListItems = getUnicornRoleListItems(unicornInfo);

            const navigateToUni = () =>
              router.push(`/unicorns/${unicornInfo.id}`);

            return (
              <div key={unicornInfo.id} className={style.contributorContainer}>
                <div
                  className={`pointer ${style.userProfilePicture}`}
                  onClick={navigateToUni}
                >
                  <Image
                    alt={unicornInfo.name + " profile picture"}
                    className="circleImg"
                    layout="responsive"
                    sizes="85px"
                    height={unicornInfo.profileImg.height}
                    width={unicornInfo.profileImg.width}
                    src={unicornInfo.profileImg.relativeServerPath}
                  />
                </div>
                <div className={style.nameRoleDiv}>
                  <Link href={`/unicorns/${unicornInfo.id}`}>
                    {unicornInfo.name}
                  </Link>
                  <ul
                    aria-label="Roles assigned to this user"
                    className={style.rolesList}
                    role="list"
                  >
                    {roleListItems}
                  </ul>
                </div>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
};

interface AboutUsMarkdownData {
  title: string;
  description: string;
}

const aboutUsLanguages = objectFilter(languages, (_, lang) => {
  return existsSync(
    join(siteDirectory, `about-us${lang !== "en" ? `.${lang}` : ""}.md`)
  );
});

export async function getStaticProps({ locale }: { locale: Languages }) {
  if (!aboutUsLanguages[locale]) {
    return {
      notFound: true,
    };
  }

  const { pickedData, frontmatterData } = readMarkdownFile<AboutUsMarkdownData>(
    join(siteDirectory, `about-us${locale !== "en" ? `.${locale}` : ""}.md`),
    {
      content: true,
      title: true,
      description: true,
    }
  );

  const { html } = await markdownToHtml(
    pickedData.content!,
    resolve(sponsorsDirectory, "..")
  );

  return {
    props: {
      allUnicorns: unicorns,
      frontmatterData,
      html,
      translations: aboutUsLanguages,
      lang: locale,
    },
  };
}

export default AboutUs;
