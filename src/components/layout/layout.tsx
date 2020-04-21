import * as React from "react";
import { graphql, Link } from "gatsby";
import BackIcon from "assets/icons/back.svg";
import layoutStyles from "./layout.module.scss";
import "../../global.scss";
import { DarkLightButton } from "../dark-light-button";
import { ThemeProvider } from "constants/theme-context";

interface LayoutProps {
	location: Location;
}
export const Layout: React.FC<LayoutProps> = ({ location, children }) => {
	const rootPath = `${__PATH_PREFIX__}/`;

	const isBase = location.pathname === rootPath;
	const isBlogPost = location.pathname.startsWith(`${rootPath}posts`);

	return (
		<ThemeProvider>
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
		</ThemeProvider>
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
			edited(formatString: "MMMM DD, YYYY")
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
			inlineCount
			headingsWithId {
				value
				slug
				depth
			}
		}
		wordCount {
			words
		}
	}
`;
