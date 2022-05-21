import React, { useEffect, useState } from "react";
import { PreviewPost } from "./get-posts";

function splitSentence(str: string): [string, string] {
  const splitStr = str.split(" ");
  const isEven = splitStr.length % 2 === 0;
  const firstHalfEnd = (isEven ? splitStr.length : splitStr.length - 1) / 2;
  const firstHalf = splitStr.splice(0, firstHalfEnd);
  // Splice mutates, so we can just return the rest
  return [firstHalf.join(" "), splitStr.join(" ")];
}

interface TwitterCodeScreenProps {
  text: string,
  direction: 'left'|'right'
}

const TwitterCodeScreen = ({
  text,
  direction
}: TwitterCodeScreenProps) => {
  const mask = `linear-gradient(to ${direction}, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))`;

  let code = text || TwitterLargeCard.toString();

  code = code
    .replaceAll('&amp;', '&')
    .replaceAll('&apos;', '\'')
    .replaceAll('&#x27;', '\'')
    .replaceAll('&#x2F;', '/')
    .replaceAll('&#39;', '\'')
    .replaceAll('&#47;', '/')
    .replaceAll('&#x3C;', '<')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&#x26;', '&')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&quot;', '"')

  return (
    <div className="absoluteFill codeScreenBg" style={{
      maskImage: mask,
      WebkitMaskImage: mask,
      filter: direction == 'right' ? 'blur(3px)' : ''
    }}>
      <div className="absoluteFill codeScreen">
        <div className="absoluteFill">
          <pre dangerouslySetInnerHTML={{__html: code}}/>
        </div>
      </div>
    </div>
  );
};

interface TwitterLargeCardProps {
  post: PreviewPost;
  postHtml: string;
  height: number;
  width: number;
  authorImagesStrs: string[];
  backgroundStr: string;
  unicornUtterancesHead: string;
}

const TwitterLargeCard = ({
  post,
  postHtml,
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
      <TwitterCodeScreen text={postHtml} direction="left"/>
      <TwitterCodeScreen text={postHtml} direction="right"/>
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
          zIndex: -1,
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
