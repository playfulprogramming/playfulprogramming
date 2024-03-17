import { useMemo } from "preact/hooks";
import info from "src/icons/info.svg?raw";
import style from "./search-result-count.module.scss";
import { forwardRef } from "preact/compat";

interface SearchResultCountProps {
	numberOfPosts: number;
	numberOfCollections: number;
}

export const SearchResultCount = forwardRef<
	HTMLDivElement | null,
	SearchResultCountProps
>(({ numberOfPosts, numberOfCollections }, ref) => {
	const language = useMemo(() => {
		let languageStr = "";
		if (numberOfPosts > 0) {
			languageStr += `${numberOfPosts} post`;
			if (numberOfPosts > 1) {
				languageStr += "s";
			}
		}
		if (numberOfCollections > 0) {
			if (languageStr !== "") {
				languageStr += " and ";
			}
			languageStr += `${numberOfCollections} collection`;
			if (numberOfCollections > 1) {
				languageStr += "s";
			}
		}
		return languageStr;
	}, [numberOfPosts, numberOfCollections]);

	return (
		<div className={style.container} ref={ref} tabIndex={-1}>
			<span
				className={style.icon}
				aria-hidden={true}
				dangerouslySetInnerHTML={{ __html: info }}
			></span>
			<h2 className={`text-style-body-large-bold ${style.text}`}>
				We found {language} in your search
			</h2>
		</div>
	);
});
