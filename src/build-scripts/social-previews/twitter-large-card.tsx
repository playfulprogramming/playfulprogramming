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
  title: string;
  html: string;
  blur: boolean;
}

const TwitterCodeScreen = ({ title, html, blur }: TwitterCodeScreenProps) => {
  const rotations = [
    'rotate3d(0.7, -1.3, -0.5, 45deg) translate(-5%, -10%)',
    'rotate3d(-0.8, -2, 1, 40deg) translate(-2%, -20%)',
    'rotate3d(-1.3, -2, 1, 50deg) translate(0%, -20%)',
    // Corbin added this to look like the original
    "rotateX(-17deg) rotateY(32deg) rotateZ(-3deg) translateX(4%)",
  ];

  // use second char of title as "deterministic" random value
  const transform = rotations[title.charCodeAt(1) % rotations.length];

  return (
    <div className={`absoluteFill codeScreenBg ${blur ? "blur" : ""}`}>
      <div
        className="absoluteFill codeScreen"
        style={
          {
            transform,
          } as React.CSSProperties
        }
      >
        <div className="absoluteFill">
          <pre dangerouslySetInnerHTML={{ __html: html }} />
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
      <TwitterCodeScreen title={post.title} html={postHtml} blur={true} />
      <TwitterCodeScreen title={post.title} html={postHtml} blur={false} />
      <div className="absoluteFill codeScreenOverlay" />
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
