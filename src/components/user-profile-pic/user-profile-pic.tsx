import * as React from "react";

import styles from "./user-profile-pic.module.scss";
import { UnicornInfo } from "uu-types";

const requirePublicImage = require.context(
  "../../../public?size=85",
  true,
  /\.(?:png|jpg|jpeg)$/
);

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
        <img
          data-testid={`author-pic-${i}`}
          src={requirePublicImage(`.${unicorn.profileImg.relativeServerPath}`)}
          alt={unicorn.name}
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
