import { useEffect, useRef, useState } from "preact/hooks";
import style from "./article-revisions.module.scss";
import down from "src/icons/chevron_down.svg?raw";
import { debounce } from "utils/debounce";

interface PopOverLocation {
	x: number;
	y: number;
}

// TRIED GETTING VARIABLE HERE
if (typeof window !== "undefined") {
	const spacing_2x = getComputedStyle(document.documentElement)
		.getPropertyValue("--spc_2x")
		.trim();
	console.log("spacing_2x", spacing_2x);
}

const tempData = [
	{ date: "October 19, 2024", version: "v3" },
	{ date: "September 22, 2022", version: "v2", selected: true },
	{ date: "February 10, 2022", version: "v1" },
];

export function ArticleRevisionDropdown() {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const date = "September 22, 2022";
	const version = "v2";

	// TODO: This should be a CSS defined value
	const SPACING = 8;

	const [popOverXY, setPopOverXY] = useState<PopOverLocation>({
		x: 0,
		y: 0,
	});

	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	const togglePopover = () => {
		setIsPopoverOpen(!isPopoverOpen);

		// Remove focus if popover is being closed
		if (isPopoverOpen && buttonRef.current) {
			buttonRef.current.blur();
		}
	};

	useEffect(() => {
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
				popovertarget="article-version-popover"
				onClick={togglePopover}
				ref={buttonRef}
			>
				<span class={style.date}>{date}</span>
				<span class={style.dot}>•</span>
				<span class={style.version}>{version}</span>
				<span
					class={style.down}
					dangerouslySetInnerHTML={{ __html: down }}
				></span>
			</button>
			{tempData.length && (
				<ul
					id="article-version-popover"
					popover
					class={style.popover}
					style={{ left: `${popOverXY.x}px`, top: `${popOverXY.y}px` }}
				>
					{tempData.map(({ date, version, selected }, i) => (
						<li
							class={`${style.item} ${selected ? style.selected : ""}`}
							key={i}
						>
							<a href="#1">
								<span class={style.date}>{date}</span>
								<span class={style.version}>{version}</span>
							</a>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
