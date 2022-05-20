import React from "react";
import { PreviewPost } from "./get-posts";
import { readFileAsBase64 } from "./read-file-as-base64";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const backgroundStr = readFileAsBase64(
  resolve(__dirname, "./assets/code_background.jpg")
);

interface TwitterLargeCardProps {
  post: PreviewPost;
  height: number;
  width: number;
}

const TwitterLargeCard = ({ post, height, width }: TwitterLargeCardProps) => {
  return (
    <div
      style={{
        height: `${height}px`,
        width: `${width}px`,
        position: "relative",
      }}
    >
      <h1>{post.title}</h1>
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
    </div>
  );
};

export default TwitterLargeCard;
