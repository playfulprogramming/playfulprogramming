import React, { useState, useMemo, useEffect } from "react"
import { graphql, Link } from "gatsby"
import BackIcon from "../../assets/icons/back.svg"
import layoutStyles from "./layout.module.scss"
import "../../global.scss"
import { DarkLightButton } from "../dark-light-button"
import {ThemeContext, setThemeColorsToVars} from '../theme-context'

export const Layout = ({ location, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`

  const isBase = location.pathname === rootPath
  const isBlogPost = location.pathname.startsWith(`${rootPath}posts`)

  const [currentTheme, setCurrentTheme] = useState('light');

  const winLocalStorage = global && global.window && global.window.localStorage;

  useEffect(() => {
    if (!winLocalStorage) return;
    const themeName = winLocalStorage.getItem('currentTheme') || 'light'
    setThemeColorsToVars(themeName);
    setCurrentTheme(themeName)
  }, [winLocalStorage])

  const setTheme = (val) => {
    setThemeColorsToVars(val);
    setCurrentTheme(val);
    localStorage.setItem('currentTheme', val)
  }

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme
    }}>
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
      }}
    >
      <header className={layoutStyles.header}>
        {!isBase && <Link className={`${layoutStyles.backBtn} baseBtn`} to={`/`}><BackIcon/></Link>}
        <DarkLightButton/>
      </header>
      <main className={!isBlogPost ? "listViewContent" : "postViewContent"}>{children}</main>
      <footer>
        {''}
      </footer>
    </div>
    </ThemeContext.Provider>
  )
}

export const authorFragmentQuery = graphql`
  fragment UnicornInfo on UnicornsJson {
    name
    id
    description
    color
    fields {
      isAuthor
    }
    roles {
      prettyname
      id
    }
    socials {
      twitter
      github
    }
    pronouns {
      they
      them
      their
      theirs
      themselves
    }
    profileImg {
      childImageSharp {
        smallPic: fixed(width: 60) {
          ...GatsbyImageSharpFixed
        }
        mediumPic: fixed(width: 85) {
          ...GatsbyImageSharpFixed
        }
        bigPic: fixed(width: 300, quality: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

export const postFragmentQuery = graphql`
  fragment PostInfo on MarkdownRemark {
    id
    excerpt(pruneLength: 160)
    html
    frontmatter {
      title
      published(formatString: "MMMM DD, YYYY")
      tags
      description
      author {
        ...UnicornInfo
      }
      license {
        licenceType
        footerImg
        explainLink
        name
        displayName
      }
    }
    fields {
      slug
    }
    wordCount {
      words
    }
  }
`
