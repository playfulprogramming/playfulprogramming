import * as React from 'preact';
import { readFileAsBase64 } from '../utils';
import { dirname, resolve } from 'path';
import * as fs from 'fs';
import { ComponentProps } from '../base';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function splitSentence(str: string): [string, string] {
  const splitStr = str.split(" ");
  const splitBy = (
    regex: RegExp,
    matchLast: boolean = true
  ): [string, string] | null => {
    const matches = splitStr.map((word, i) => ({ reg: regex.exec(word), i }));
    const match = (matchLast ? matches.reverse() : matches)
      .slice(1, -1)
      .find(({ reg }) => !!reg);

    // if match is not found, fail
    if (!match || !match.reg) return null;

    const firstHalf = [
      ...splitStr.slice(0, match.i),
      match.reg.input.substring(0, match.reg.index),
    ].join(" ");
    const secondHalf = [match.reg[0], ...splitStr.slice(match.i + 1)].join(" ");
    return [firstHalf, secondHalf];
  };

  let ret;
  // try to split by "Topic[: Attribute]" or "Topic [- Attribute]" (hyphens/colons)
  if ((ret = splitBy(/(?<=^\w+):$|^[-—]$/))) return ret;
  // try to split by "Attribute in [Topic, Topic, and Topic]" (commas)
  if ((ret = splitBy(/^\w+,$/, false))) return ret;
  // try to split by "Topic['s Attribute]" (apostrophe)
  if ((ret = splitBy(/(?<=^\w+\'s?)$/))) return ret;
  // try to split by "Attribute [in Topic]" (lowercase words)
  if ((ret = splitBy(/^[a-z][A-Za-z]*$/))) return ret;
  // otherwise, don't split the string
  return [str, ""];
}

const unicornUtterancesHead = readFileAsBase64(
	resolve("src/assets/unicorn_head_1024.png")
);

interface TwitterCodeScreenProps {
  title: string;
  html: string;
  blur: boolean;
}

const TwitterCodeScreen = ({ title, html, blur }: TwitterCodeScreenProps) => {
  const rotations = [
    "rotateX(-17deg) rotateY(32deg) rotateZ(-3deg) translate(16%, 0%)",
    "rotateX(5deg) rotateY(35deg) rotateZ(345deg) translate(18%, 0)",
    "rotateX(15deg) rotateY(25deg) rotateZ(12deg) translate(3%, -15%)",
  ];

  // use second char of title as "deterministic" random value
  const transform = rotations[title.charCodeAt(1) % rotations.length];

  return (
    <div className={`absoluteFill codeScreenBg ${blur ? "blur" : ""}`}>
      <div
        className="absoluteFill codeScreen"
        style={`transform: ${transform};`}
      >
        <div className="absoluteFill">
          <pre dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
};
const TwitterLargeCard = ({
  post,
  postHtml,
  height,
  width,
  authorImageMap,
}: ComponentProps) => {
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
          {firstHalfTitle}
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
          {post.authors.map((author) => (
            <img
              key={author}
              src={authorImageMap[author]}
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

export default {
  name: "twitter-preview",
  css: fs.readFileSync(
		resolve(__dirname, "./twitter-preview.css"),
		"utf8"
	),
  Component: TwitterLargeCard,
};
