import { useEffect, useRef, useState } from "preact/hooks";
import style from "./article-revisions.module.scss";
import down from "src/icons/chevron_down.svg?raw";
import { debounce } from "utils/debounce";
import { PostInfo, PostVersion } from "types/PostInfo";
import { siteMetadata } from "constants/site-config";
import { Option } from "components/select/basic-option";

interface PopOverLocation {
	x: number;
	y: number;
}

interface ArticleRevisionDropdownProps {
	post: PostInfo;
	versions: PostVersion[];
}

export function ArticleRevisionDropdown({
	post,
	versions,
}: ArticleRevisionDropdownProps) {
	const { slug, publishedMeta, version } = post;
	const buttonRef = useRef<HTMLButtonElement>(null);

	const currentPostVersion = versions.filter(({ href }) => href.endsWith(slug));

	const date = currentPostVersion.length
		? currentPostVersion[0]["publishedMeta"]
		: publishedMeta;

	const buttonVersion = currentPostVersion.length
		? currentPostVersion[0]["version"]
		: version
			? version
			: "";

	const postHistory = `https://github.com/${siteMetadata.repoPath}/commits/main/content/${post.path}/index.md`;

	// TODO: This should be a CSS defined value
	const SPACING = 8;

	const [supportsAnchors, setSupportsAnchors] = useState<boolean>(false);
	const [popOverXY, setPopOverXY] = useState<PopOverLocation>({
		x: 0,
		y: 0,
	});

	useEffect(() => {
		setSupportsAnchors(CSS.supports("top: anchor(bottom)"));
		if (buttonRef.current) {
			const buttonRect = buttonRef.current.getBoundingClientRect();
			const x = buttonRect.left - 12;
			const y = buttonRect.bottom + SPACING;

			setPopOverXY({ x, y });
		}

		const setPopOverLocation = debounce(
			() => {
				if (buttonRef.current) {
					const buttonRect = buttonRef.current.getBoundingClientRect();
					const x = buttonRect.left - 12;
					const y = buttonRect.bottom + SPACING;
					setPopOverXY({ x, y });
				}
			},
			100,
			false,
		);

		window.addEventListener("resize", setPopOverLocation);

		return () => window.removeEventListener("resize", setPopOverLocation);
	}, []);

	return (
		<div>
			<button
				class={style.button}
				type="button"
				popovertarget="article-versions-list"
				ref={supportsAnchors ? undefined : buttonRef}
				aria-controls="article-versions-list"
				aria-haspopup="menu"
			>
				<span class={style.date}>{date}</span>
				<span class={style.dot}>{buttonVersion ? "•" : ""}</span>
				<span class={style.version}>{buttonVersion}</span>
				<span
					class={style.down}
					dangerouslySetInnerHTML={{ __html: down }}
				></span>
			</button>
			<ul
				id="article-versions-list"
				popover
				class={`${style.popover} ${supportsAnchors ? style.anchored : ""}`}
				style={
					supportsAnchors
						? ""
						: { left: `${popOverXY.x}px`, top: `${popOverXY.y}px` }
				}
			>
				{versions.map(({ href, publishedMeta, version }, i) => (
					<Option key={i}>
						<a
							class={`${style.item} ${href.endsWith(slug) ? style.selected : ""}`}
							aria-current={href.endsWith(slug) ? "page" : undefined}
							href={href}
						>
							<span class={`text-style-button-regular ${style.date}`}>
								{publishedMeta}
							</span>
							<span class={`text-style-button-regular ${style.version}`}>
								{version}
							</span>
						</a>
					</Option>
				))}
				<Option>
					<hr class={style.divider} />
				</Option>
				<Option>
					<a class={style.changelog} href={postHistory} target="_blank">
						<span class="text-style-button-regular">View Changelog</span>
					</a>
				</Option>
			</ul>
		</div>
	);
}
