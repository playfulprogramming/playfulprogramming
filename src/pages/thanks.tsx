import React from "react";

import Image from "next/image";
import { SEO } from "components/seo";
import proudUnicorn from "assets/proud_2048.png";
import { useRouter } from "next/router";
import { Languages } from "types/index";

const ThanksPage = () => {
  const router = useRouter();
  return (
    <>
      <SEO title="Thank You!" pathName={router.asPath} />
      <div
        style={{
          width: "100%",
        }}
      >
        <div
          style={{
            width: "calc(100vw - 40px)",
            height: "calc(100vw - 40px)",
            maxWidth: "450px",
            maxHeight: "450px",
            background: "var(--primary)",
            borderRadius: "100%",
            overflow: "hidden",
            margin: "0 auto",
            display: "block",
          }}
        >
          <Image
            src={proudUnicorn}
            loading={"eager"}
            sizes="500px"
            layout={"responsive"}
            alt={`Unicorn Utterances 404 image`}
          />
        </div>
      </div>
      <h1 style={{ textAlign: "center" }}>Thank you for subscribing.</h1>
      <p style={{ textAlign: "center" }}>
        Your subscription is now confirmed. You can expect to receive emails as
        we create new content.
      </p>
    </>
  );
};

export default ThanksPage;

export async function getStaticProps({ locale }: { locale: Languages }) {
  if (locale !== "en") {
    return {
      notFound: true,
    };
  }
}
