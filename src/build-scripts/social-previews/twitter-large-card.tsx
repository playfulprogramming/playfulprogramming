import React from "react";
import { PreviewPost } from "./get-posts";

interface TwitterLargeCardProps {
  post: PreviewPost;
}

const TwitterLargeCard = ({ post }: TwitterLargeCardProps) => {
  return (
    <>
      <h1>{post.title}</h1>
    </>
  );
};

export default TwitterLargeCard;
