// import { useEffect, useRef, useState } from "preact/hooks";
import style from "./article-revisions.module.scss";
import down from "src/icons/chevron_down.svg?raw";
// import { debounce } from "utils/debounce";
import { PostInfo, PostVersion } from "types/PostInfo";

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
	// const buttonRef = useRef<HTMLButtonElement>(null);

	const currentPostVersion = versions.filter(({ href }) => href === slug);

	const date = currentPostVersion.length
		? currentPostVersion[0]["publishedMeta"]
		: publishedMeta;

	const buttonVersion = currentPostVersion.length
		? currentPostVersion[0]["version"]
		: version
			? version
			: "";

	// TODO: This should be a CSS defined value
	// const SPACING = 8;

	// const [popOverXY, setPopOverXY] = useState<PopOverLocation>({
	// 	x: 0,
	// 	y: 0,
	// });

	// const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	// const togglePopover = () => {
	// 	setIsPopoverOpen(!isPopoverOpen);

	// 	// Remove focus if popover is being closed
	// 	if (isPopoverOpen && buttonRef.current) {
	// 		buttonRef.current.blur();
	// 	}
	// };

	// useEffect(() => {
	// 	if (buttonRef.current) {
	// 		const buttonRect = buttonRef.current.getBoundingClientRect();
	// 		const x = buttonRect.left - 12;
	// 		const y = buttonRect.bottom + SPACING;
	// 		setPopOverXY({ x, y });
	// 	}

	// 	const setPopOverLocation = debounce(
	// 		() => {
	// 			if (buttonRef.current) {
	// 				const buttonRect = buttonRef.current.getBoundingClientRect();
	// 				const x = buttonRect.left - 12;
	// 				const y = buttonRect.bottom + SPACING;
	// 				setPopOverXY({ x, y });
	// 			}
	// 		},
	// 		100,
	// 		false,
	// 	);

	// 	window.addEventListener("resize", setPopOverLocation);

	// 	return () => window.removeEventListener("resize", setPopOverLocation);
	// }, []);

	return (
		<div>
			<button
				class={style.button}
				type="button"
				popovertarget="article-version-popover"
				// onClick={togglePopover}
				// ref={buttonRef}
			>
				<span class={style.date}>{date}</span>
				<span class={style.dot}>{buttonVersion ? "•" : ""}</span>
				<span class={style.version}>{buttonVersion}</span>
				<span
					class={style.down}
					dangerouslySetInnerHTML={{ __html: down }}
				></span>
			</button>
			{versions.length && (
				<ul
					id="article-version-popover"
					popover
					class={style.popover}
					// style={{ left: `${popOverXY.x}px`, top: `${popOverXY.y}px` }}
				>
					{versions.map(({ href, publishedMeta, version }, i) => (
						<li
							class={`${style.item} ${slug === href ? style.selected : ""}`}
							key={i}
						>
							<a href={href}>
								<span class={style.date}>{publishedMeta}</span>
								<span class={style.version}>{version}</span>
							</a>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
