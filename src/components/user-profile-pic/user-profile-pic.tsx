import * as React from "react";

import styles from "./user-profile-pic.module.scss";
import { UnicornInfo } from "uu-types";
import Image from "next/image";

interface UserProfilePicProps {
  authors: Array<{ unicorn: UnicornInfo; onClick: React.MouseEventHandler }>;
  className: string;
}
export const UserProfilePic = ({ authors, className }: UserProfilePicProps) => {
  const hasTwoAuthors = authors.length !== 1;

  const authorsLinks = authors.map(({ unicorn, onClick }, i) => {
    const classesToApply = hasTwoAuthors ? styles.twoAuthor : "";

    return (
      <div
        key={unicorn.id}
        onClick={onClick}
        className={`pointer ${styles.profilePicContainer} ${classesToApply}`}
        style={{
          borderColor: unicorn.color,
        }}
      >
        <Image
          data-testid={`author-pic-${i}`}
          src={unicorn.profileImg.relativeServerPath}
          alt={unicorn.name}
          sizes={"85px"}
          layout={"fill"}
          className={`circleImg ${styles.profilePicImage} ${styles.width50} ${classesToApply}`}
        />
      </div>
    );
  });

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {authorsLinks}
    </div>
  );
};
