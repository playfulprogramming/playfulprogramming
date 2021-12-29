import React from "react";
import Link from "next/link";
import Image from "next/image";
import style from "../page-components/about/about.module.scss";
import { UnicornInfo } from "uu-types";
import { siteDirectory, sponsorsDirectory, unicorns } from "utils/fs/get-datas";
import { useRouter } from "next/router";
import { readMarkdownFile } from "utils/fs/api";
import { join } from "path";
import markdownToHtml from "utils/markdown/markdownToHtml";
import { useMarkdownRenderer } from "utils/markdown/useMarkdownRenderer";
const unicornLogo = require("../assets/unicorn_head_1024.png?size=192");

const requirePublicImage = require.context(
  "../../public?size=85",
  true,
  /\.(?:png|jpg|jpeg)$/
);

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
}

const AboutUs = ({ allUnicorns, html }: AboutUsProps) => {
  const router = useRouter();

  const result = useMarkdownRenderer({
    markdownHTML: html,
    serverPath: [""],
  });

  return (
    <div>
      {/*<SEO*/}
      {/*  title={post.frontmatter.title}*/}
      {/*  description={post.frontmatter.description || post.excerpt}*/}
      {/*  pathName={props.location.pathname}*/}
      {/*/>*/}
      <div className={style.container}>
        <div className={style.headerTitle}>
          <div className={style.unicornLogo}>
            <img
              src={unicornLogo}
              loading={"eager"}
              alt={"Unicorn Utterances logo"}
            />
          </div>
          <h1>About Us</h1>
        </div>
        <main className={`${style.aboutBody} post-body`}>
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
                  <img
                    alt={unicornInfo.name + " profile picture"}
                    className="circleImg"
                    sizes="85px"
                    src={requirePublicImage(
                      unicornInfo.profileImg.relativeServerPath
                    )}
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

export async function getStaticProps() {
  const { pickedData, frontmatterData } = readMarkdownFile<AboutUsMarkdownData>(
    join(siteDirectory, "about-us.md"),
    {
      content: true,
      title: true,
      description: true,
    }
  );

  const { html } = await markdownToHtml(pickedData.content!, sponsorsDirectory);

  return {
    props: {
      allUnicorns: unicorns,
      frontmatterData,
      html,
    },
  };
}

export default AboutUs;
