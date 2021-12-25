import React from "react";

import Image from "next/image";
import { SEO } from "components/seo";
import { useRouter } from "next/router";
const helloUnicorn = require("../assets/hello_2048.png");

const ConfirmPage = () => {
  const router = useRouter();
  return (
    <>
      <SEO title="Confirm Your Email" pathName={router.pathname} />
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
          <img
            src={helloUnicorn}
            loading={"eager"}
            alt={`A happy unicorn`}
            height={"100%"}
            width={"100%"}
          />
        </div>
      </div>
      <h1 style={{ textAlign: "center" }}>Just one more thing...</h1>
      <p style={{ textAlign: "center" }}>
        Thank you for subscribing. You will need to check your inbox and confirm
        your subscription.
      </p>
    </>
  );
};

export default ConfirmPage;
