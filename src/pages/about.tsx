import React from "react";
import Link from "next/link";
import Image from "next/image";
import style from "../page-components/about/about.module.scss";
import { UnicornInfo } from "uu-types";
import { siteDirectory, sponsorsDirectory, unicorns } from "utils/fs/get-datas";
import unicornLogo from "../assets/unicorn_head_1024.png";
import { useRouter } from "next/router";
import { readMarkdownFile } from "utils/fs/api";
import { join } from "path";
import markdownToHtml from "utils/markdown/markdown-to-html";
import { MarkdownRenderer, Source } from "utils/markdown/markdown-renderer";
import { SEO } from "components/seo";

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
  source: Source;
}

const AboutUs = ({ allUnicorns, source }: AboutUsProps) => {
  const router = useRouter();

  return (
    <div>
      <SEO title="About Us" pathName={router.pathname} />
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
          <div>
            <MarkdownRenderer serverPath={[""]} source={source} />
          </div>
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

export async function getStaticProps() {
  const { pickedData, frontmatterData } = readMarkdownFile<AboutUsMarkdownData>(
    join(siteDirectory, "about-us.md"),
    {
      content: true,
      title: true,
      description: true,
    }
  );

  const { source } = await markdownToHtml(
    pickedData.content!,
    sponsorsDirectory
  );

  return {
    props: {
      allUnicorns: unicorns,
      frontmatterData,
      source,
    },
  };
}

export default AboutUs;
