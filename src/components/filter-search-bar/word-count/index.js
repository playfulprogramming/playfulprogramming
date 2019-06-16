import React from "react"
import wordCountStyles from "./style.module.css"
import FeatherIcon from "../../../assets/icons/feather.svg"

const WordCount = ({ numberOfArticles = 0, wordCount = 0 }) => {
  return (
    <div className={wordCountStyles.container}>
      <FeatherIcon className={wordCountStyles.icon}/>
      <p>{numberOfArticles} Articles</p>
      <div className={wordCountStyles.divider}/>
      <p>{wordCount} Words</p>
    </div>
  )
}

export default WordCount
