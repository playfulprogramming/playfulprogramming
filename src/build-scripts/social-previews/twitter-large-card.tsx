import React from "react";
import { PreviewPost } from "./get-posts";
import { readFileAsBase64 } from "./read-file-as-base64";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const backgroundStr = readFileAsBase64(
  resolve(__dirname, "./assets/code_background.jpg")
);

const unicornUtterancesHead = readFileAsBase64(
  resolve(__dirname, "../../assets/unicorn_head_1024.png")
);

interface TwitterLargeCardProps {
  post: PreviewPost;
  height: number;
  width: number;
  authorImagesStrs: string[];
}

const TwitterLargeCard = ({
  post,
  height,
  width,
  authorImagesStrs,
}: TwitterLargeCardProps) => {
  const title = post.title;
  return (
    <div
      style={{
        height: `${height}px`,
        width: `${width}px`,
        position: "relative",
      }}
    >
      <div className="absoluteFill centerAll">
        <h1
          style={{
            maxWidth: "90%",
            textAlign: "center",
            fontSize: `clamp(300%, 4.5rem, ${
              Math.round(width / title.length) * 3
            }px)`,
          }}
        >
          {title}
        </h1>
      </div>
      <div
        className="absoluteFill backgroundColor"
        style={{
          zIndex: -2,
        }}
      />
      <div
        className="absoluteFill backgroundImage"
        style={{
          zIndex: -1,
          backgroundImage: `url("${backgroundStr}")`,
        }}
      />
      <div className="bottomContainer">
        <div className="bottomImagesContainer centerAll">
          {authorImagesStrs.map((authorStr) => (
            <img
              key={authorStr}
              src={authorStr}
              alt=""
              className="bottomProfImg"
              height={80}
              width={80}
            />
          ))}
        </div>
        <div className="bottomImagesContainer centerAll">
          <p>unicorn-utterances.com</p>
          <img src={unicornUtterancesHead} alt="" height={80} width={80} />
        </div>
      </div>
    </div>
  );
};

export default TwitterLargeCard;
