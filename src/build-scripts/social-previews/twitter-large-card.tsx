import React from "react";
import { PreviewPost } from "./get-posts";
import { readFileAsBase64 } from "./read-file-as-base64";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

function splitSentence(str: string): [string, string] {
  const splitStr = str.split(" ");
  const isEven = splitStr.length % 2 === 0;
  const firstHalfEnd = (isEven ? splitStr.length : splitStr.length - 1) / 2;
  const firstHalf = splitStr.splice(0, firstHalfEnd);
  // Splice mutates, so we can just return the rest
  return [firstHalf.join(" "), splitStr.join(" ")];
}

interface TwitterLargeCardProps {
  post: PreviewPost;
  height: number;
  width: number;
  authorImagesStrs: string[];
  backgroundStr: string;
  unicornUtterancesHead: string;
}

const TwitterLargeCard = ({
  post,
  height,
  width,
  authorImagesStrs,
  backgroundStr,
  unicornUtterancesHead,
}: TwitterLargeCardProps) => {
  const title = post.title;
  const [firstHalfTitle, secondHalfTitle] = splitSentence(title);
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
          {firstHalfTitle}{" "}
          <span className="secondHalfTitle">{secondHalfTitle}</span>
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
