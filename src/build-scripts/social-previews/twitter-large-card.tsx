import React from "react";
import { PreviewPost } from "./get-posts";
import { readFileAsBase64 } from "./read-file-as-base64";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

function splitSentence(str: string): [string, string] {
  const splitStr = str.split(" ");
  const splitBy = (regex: RegExp, matchLast: boolean = true): [string, string]|null => {
    const matches = splitStr.map((word, i) => ({ reg: regex.exec(word), i }));
    const match = (matchLast ? matches.reverse() : matches)
      .slice(1, -1)
      .find(({reg}) => !!reg);

    // if match is not found, fail
    if (!match || !match.reg) return null;

    const firstHalf = [...splitStr.slice(0, match.i), match.reg.input.substring(0, match.reg.index)].join(" ");
    const secondHalf = [match.reg[0], ...splitStr.slice(match.i+1)].join(" ");
    return [firstHalf, secondHalf];
  };

  let ret;
  // try to split by "Topic[: Attribute]" or "Topic [- Attribute]" (hyphens/colons)
  if (ret = splitBy(/(?<=^\w+):$|^[-—]$/)) return ret;
  // try to split by "Attribute in [Topic, Topic, and Topic]" (commas)
  if (ret = splitBy(/^\w+,$/, false)) return ret;
  // try to split by "Topic['s Attribute]" (apostrophe)
  if (ret = splitBy(/(?<=^\w+\'s?)$/)) return ret;
  // try to split by "Attribute [in Topic]" (lowercase words)
  if (ret = splitBy(/^[a-z]\w+$/)) return ret;
  // otherwise, don't split the string
  return [str, ""];
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
          {firstHalfTitle}
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
