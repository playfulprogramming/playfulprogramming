import React from "react";

import Image from "next/image";
import { SEO } from "components/seo";
import sadUnicorn from "assets/sad_unicorn_2048.png";
import { siteMetadata } from "constants/site-config";
import { useRouter } from "next/router";
import { OutboundLink } from "components/outbound-link";

const NotFoundPage = () => {
  const router = useRouter();
  return (
    <>
      <SEO title="404: Not Found" pathName={router.pathname} />
      <div
        style={{
          width: "100%",
        }}
      >
        <div
          style={{
            margin: "0 auto",
            display: "block",
            width: "500px",
            height: "500px",
          }}
        >
          <Image
            src={sadUnicorn}
            loading={"eager"}
            sizes="500px"
            layout={"responsive"}
            alt={`Unicorn Utterances 404 image`}
          />
        </div>
      </div>
      <h1 style={{ textAlign: "center" }}>
        We&apos;re Sorry, We Don&apos;t Understand
      </h1>
      <p style={{ textAlign: "center" }}>
        We don&apos;t quite understand where you&apos;re trying to go!
        We&apos;re really sorry about this!
        <br />
        Maybe the URL has a typo in it or we&apos;ve configured something wrong!
        <br />
        <OutboundLink
          href={`https://github.com/${siteMetadata.repoPath}/issues`}
        >
          If you really think it might be something we did, let us know!
        </OutboundLink>
      </p>
    </>
  );
};

export default NotFoundPage;
