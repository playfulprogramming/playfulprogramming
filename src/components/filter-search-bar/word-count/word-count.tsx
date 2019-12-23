import React from "react";
import wordCountStyles from "./word-count.module.scss";
import { Feather as FeatherIcon } from "../../../assets/icons/feather";

export const WordCount = ({ numberOfArticles = 0, wordCount = 0 }) => {
	return (
		<div className={wordCountStyles.container}>
			<FeatherIcon className={wordCountStyles.icon} />
			<p>{numberOfArticles} Articles</p>
			<div className={wordCountStyles.divider} />
			<p>{wordCount} Words</p>
		</div>
	);
};
