import React, { useContext, useMemo, useState } from "react";
import styles from "./search-field.module.scss";
import classNames from "classnames";
import SearchIcon from "../../../assets/icons/search.svg";
import { useElementBoundingBox } from "../../../utils/useRefBoundingBox";
import posed from "react-pose";
import { SearchAndFilterContext } from "../../search-and-filter-context";

const placeholder = "Search";

const PosedInput = posed.input({
	initial: {
		width: props => props.wiidth
	}
});

export const SearchField = ({ className }) => {
	const { setSearchVal, searchVal } = useContext(SearchAndFilterContext);
	const [isFocused, setIsFocused] = useState(false);

	const { ref: containerRef, width: maxSpanWidth } = useElementBoundingBox();
	const { ref: inputRef, height: inputHeight } = useElementBoundingBox();
	const { ref: spanRef, width: currInputWidth } = useElementBoundingBox(
		searchVal,
		a => ({
			...a,
			width: a.width + 50
		})
	);

	/**
	 * Class calculation
	 */
	const wrapperClasses = useMemo(() => {
		return classNames(styles.btn, {
			[styles.contentBtn]: isFocused || searchVal
		});
	}, [isFocused, searchVal]);

	const innerWinSize = global.window && window.innerWidth;

	return (
		// 70 as it's the size of all padding/etc more than just the input
		<div className={`${className} ${styles.container}`}>
			<div className={wrapperClasses} onClick={() => inputRef.current.focus()}>
				<SearchIcon className={styles.icon} />
				<div className={styles.inputContainer} ref={containerRef}>
					<div style={{ height: inputHeight }} />
					<PosedInput
						placeholder={placeholder}
						ref={inputRef}
						aria-label="Search for posts"
						onChange={e => {
							const val = e.target.value;
							setSearchVal(val);
						}}
						wiidth={innerWinSize >= 450 ? currInputWidth : "100%"}
						poseKey={`${searchVal || currInputWidth}${innerWinSize}`}
						pose="initial"
						value={searchVal}
						onFocus={() => setIsFocused(true)}
						style={{ maxWidth: maxSpanWidth }}
						onBlur={() => setIsFocused(false)}
						className={styles.input}
					/>
					{/*
            We want to hide this span as it acts as a placeholder for sizing
            purposes so we can know what the min or max side of the input should
            be
          */}
					<span
						aria-hidden={true}
						className={styles.input}
						style={{
							position: "absolute",
							top: "-300vh"
						}}
						ref={spanRef}
					>
						{searchVal || placeholder}
					</span>
				</div>
			</div>
		</div>
	);
};
