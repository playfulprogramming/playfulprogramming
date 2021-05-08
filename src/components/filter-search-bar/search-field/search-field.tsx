import React, { useCallback, useContext, useMemo, useState } from "react";
import * as styles from "./search-field.module.scss";
import classNames from "classnames";
import SearchIcon from "assets/icons/search.svg";
import { SearchAndFilterContext } from "uu-constants";
import { useElementBounds } from "uu-utils";
import { motion, Variants } from "framer-motion";

const placeholder = "Search";

const PosedInput = React.forwardRef<
	any,
	React.ComponentProps<typeof motion.input>
>(({ children, ...props }, ref) => {
	const variants: Variants = {
		initial: (target) => ({
			width: target,
		}),
	};

	return (
		<motion.input
			{...props}
			variants={variants}
			animate={"initial"}
			transition={{ ease: "linear", duration: 0.2 }}
			ref={ref}
		>
			{children}
		</motion.input>
	);
});

export const SearchField = ({ className }: { className?: string }) => {
	const { setSearchVal, searchVal } = useContext(SearchAndFilterContext);
	const [isFocused, setIsFocused] = useState(false);

	// Set the node reference for the input for click listening
	const [inputNode, setInputNode] = useState<HTMLElement>();
	// Get a callback reference to get the element bounds
	const {
		ref: elBoundsCBRef,
		val: { height: inputHeight },
	} = useElementBounds([]);
	// Create a callback reference to compose both the callback bound ref and the "real" ref
	const inputCallbackRef = useCallback(
		(node: HTMLInputElement) => {
			elBoundsCBRef(node);
			setInputNode(node);
		},
		[elBoundsCBRef, setInputNode]
	);
	const {
		ref: containerRef,
		val: { width: maxSpanWidth },
	} = useElementBounds([]);
	const {
		ref: spanRef,
		val: { width: currInputWidth },
	} = useElementBounds([searchVal], (a) => ({
		...a,
		width: a.width + 50,
	}));

	/**
	 * Class calculation
	 */
	const wrapperClasses = useMemo(() => {
		return classNames(styles.btn, {
			[styles.contentBtn]: isFocused || searchVal,
		});
	}, [isFocused, searchVal]);

	const innerWinSize = (global as any).window && window.innerWidth;

	return (
		// 70 as it's the size of all padding/etc more than just the input
		<div className={`${className} ${styles.container}`}>
			<div className={wrapperClasses} onClick={() => inputNode!.focus()}>
				<SearchIcon className={styles.icon} />
				<div className={styles.inputContainer} ref={containerRef as any}>
					<div style={{ height: inputHeight }} />
					<PosedInput
						placeholder={placeholder}
						ref={inputCallbackRef}
						aria-label="Search for posts"
						onChange={(e) => {
							const val = (e.target as HTMLInputElement).value;
							setSearchVal(val);
						}}
						custom={innerWinSize >= 450 ? currInputWidth : "100%"}
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
							top: "-300vh",
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
