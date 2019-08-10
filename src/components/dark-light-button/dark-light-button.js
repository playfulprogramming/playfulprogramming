import React from "react"
import DarkIcon from "../../assets/icons/dark.svg"
import LightIcon from "../../assets/icons/light.svg"
import btnStyles from "./dark-light-button.module.scss"

export const DarkLightButton = () => {
  return (
    <button className={`${btnStyles.darkLightBtn} baseBtn`} onClick={toDark}><DarkIcon/></button>
  )
}

function toDark() {
  //alert("yes");
  let style = document.documentElement.style;
  //css variable names might need to be changed a bit
  style.setProperty("--darkPrimary", "#E4F4FF");
  style.setProperty("--black", "white"); //🎵 we're gonna party like it's nine-teen eighty-fourrrrrrr 🎵
  style.setProperty("--white", "black");
  style.setProperty("--darkGrey", "rgba(255, 255, 255, .64)");
  style.setProperty("--highImpactBlack", "rgba(255, 255, 255, .87)");
  style.setProperty("--midImpactBlack", "rgba(255, 255, 255, .64)");
  style.setProperty("--lowImpactBlack", "rgba(255, 255, 255, .58)");
  style.setProperty("--backgroundColor", "#072a41"); //from tommy's mockup
  style.setProperty("--cardActiveBackground", "#163954"); //from tommy's mockup
  style.setProperty("--cardActiveBoxShadow", "0px 2px 4px rgba(255, 255, 255, 0.27), inset 0px 1px 0px #000000"); //very very extremely temporary and ugly


}
