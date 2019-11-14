import React, { useState, useEffect } from "react";
import { graphql, Link } from "gatsby";
import BackIcon from "../../assets/icons/back.svg";
import layoutStyles from "./layout.module.scss";
import "../../global.scss";
import { DarkLightButton } from "../dark-light-button";
import { ThemeContext, setThemeColorsToVars } from "../theme-context";

export const Layout = ({ location, children }) => {
	// eslint-disable-next-line no-undef
	const rootPath = `${__PATH_PREFIX__}/`;

	const isBase = location.pathname === rootPath;
	const isBlogPost = location.pathname.startsWith(`${rootPath}posts`);

	const [currentTheme, setCurrentTheme] = useState("light");

	const winLocalStorage = global && global.window && global.window.localStorage;

	useEffect(() => {
		if (!winLocalStorage) return;
		const themeName = winLocalStorage.getItem("currentTheme") || "light";
		setThemeColorsToVars(themeName);
		setCurrentTheme(themeName);
	}, [winLocalStorage]);

	const setTheme = val => {
		setThemeColorsToVars(val);
		setCurrentTheme(val);
		localStorage.setItem("currentTheme", val);
	};

	return (
		<ThemeContext.Provider
			value={{
				currentTheme,
				setTheme
			}}
		>
			<div className={layoutStyles.horizCenter}>
				<header
					className={layoutStyles.header}
					aria-label={"Toolbar for primary action buttons"}
				>
					{!isBase && (
						<Link
							className={`${layoutStyles.backBtn} baseBtn`}
							to={`/`}
							aria-label="Go back"
						>
							<BackIcon />
						</Link>
					)}
					<DarkLightButton />
				</header>
				<div className={!isBlogPost ? "listViewContent" : "postViewContent"}>
					{children}
				</div>
			</div>
		</ThemeContext.Provider>
	);
};

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
			website
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
`;

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
			authors {
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
`;
