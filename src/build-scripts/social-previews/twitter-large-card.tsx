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
  title: string,
  html: string,
  blur: boolean
}

const TwitterCodeScreen = ({
  title,
  html,
  blur
}: TwitterCodeScreenProps) => {
  // use first char of title as "deterministic" random value
  const rotation = (index: number, max: number) => {
    const val = -max + (title.charCodeAt(index)/5 % (2*max));
    return Math.log(2 + Math.abs(val)) * (val<0?-1:1);
  };

  return (
    <div className={`absoluteFill codeScreenBg ${blur?'blur':''}`} style={{
      '--rot-x': rotation(0, 1.5),
      '--rot-y': rotation(1, 2),
    } as React.CSSProperties}>
      <div className="absoluteFill codeScreen">
        <div className="absoluteFill">
          <pre dangerouslySetInnerHTML={{__html: html}}/>
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
  unicornUtterancesHead: string;
}

const TwitterLargeCard = ({
  post,
  postHtml,
  height,
  width,
  authorImagesStrs,
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
        overflow: "hidden",
      }}
    >
      <TwitterCodeScreen title={post.title} html={postHtml} blur={true}/>
      <TwitterCodeScreen title={post.title} html={postHtml} blur={false}/>
      <div className="absoluteFill codeScreenOverlay"/>
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
