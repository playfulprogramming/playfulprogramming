/**
 * This code is currently unused and does not function as-expected
 *
 * It is left as a starting point for #2
 */
import React, { useMemo, useRef } from "react";
import classNames from "classnames";
import posed from "react-pose";

import filterStyles from "./dropdown-button.module.scss";

import FilterIcon from "../../../assets/icons/filter.svg";

import { useSelectRef } from "../../utils/a11y/useSelectRef";
import { useWindowSize } from "../../utils/useWindowSize";
import { useAfterInit } from "../../utils/useAfterInit";

const FilterListItem = ({ tag, index, active, expanded, selectIndex }) => {
	const liClassName = classNames(filterStyles.option, {
		[filterStyles.active]: active.index === index,
		[filterStyles.selected]: tag.selected,
		[filterStyles.expanded]: expanded
	});
	return (
		<li
			className={liClassName}
			role="option"
			onClick={e => expanded && selectIndex(index, e, e.type)}
			id={tag.id}
			aria-selected={tag.selected}
		>
			<span>{tag.val}</span>
		</li>
	);
};

const FilterDisplaySpan = posed.span({
	initial: {
		width: props => props.wiidth || 0,
		height: props => props.heiight
	}
});

const ListIdBox = posed.ul({
	expanded: {
		height: "auto"
	},
	hidden: {
		height: props => props.heiight
	}
});

/**
 *
 * @param valArr
 * @param {React.ReactElement} childComp
 * @param {'single' | 'mutli' | false} allowSelect
 * @param onPress
 * @returns {*}
 * @constructor
 */
export const DropdownButton = ({
	valArr = [],
	childComp,
	allowSelect,
	onPress
}) => {
	const {
		ref: listBoxRef,
		active,
		values,
		selected,
		selectIndex,
		expanded,
		usedKeyboardLast,
		parentRef,
		buttonProps
	} = useSelectRef(valArr, allowSelect, onPress);
	const shouldShowFilterMsg = expanded || !selected.length;

	/**
	 * Refs
	 */
	const filterTextRef = useRef();
	const appliedFiltersTextRef = useRef();
	const btnRef = useRef();
	const containerRef = useRef();

	const windowSize = useWindowSize(150);

	/**
	 * Value calcs
	 */
	const appliedTagsStr = useMemo(() => {
		if (!selected.length) return "";
		return selected.map(v => v.val).join(", ");
	}, [selected]);

	/**
	 * Bounding Box Matches
	 */

	// Make bounding boxes work properly
	const afterInit = useAfterInit();

	const currentSpanHeight = useMemo(() => {
		if (!filterTextRef.current || !filterTextRef.current) return 0;
		const filtTxtBound = filterTextRef.current.getBoundingClientRect();
		const appliedFiltBound = appliedFiltersTextRef.current.getBoundingClientRect();
		return filtTxtBound.height < appliedFiltBound.height
			? appliedFiltBound.height
			: filtTxtBound.height;
	}, [appliedFiltersTextRef, filterTextRef]);

	const currentBtnHeight = useMemo(() => {
		if (!btnRef.current) return 0;
		const btnRefBound = btnRef.current.getBoundingClientRect();
		return btnRefBound.height;
	}, []);

	const currentSpanWidth = useMemo(() => {
		if (!filterTextRef.current || !filterTextRef.current) return 0;
		if (shouldShowFilterMsg) {
			const filtTxtBound = filterTextRef.current.getBoundingClientRect();
			let toReturn = filtTxtBound.width;
			if (expanded) {
				toReturn += 100;
			}
			return toReturn;
		}

		const appliedFiltBound = appliedFiltersTextRef.current.getBoundingClientRect();
		return appliedFiltBound.width;
	}, [shouldShowFilterMsg, expanded]);

	const maxSpanWidth = useMemo(() => {
		if (!containerRef.current) return 0;
		const containerRefBounding = containerRef.current.getBoundingClientRect();
		return containerRefBounding.width;
	}, [containerRef]);

	/**
	 * Class names
	 */
	const containerClassName = useMemo(
		() =>
			classNames({
				[filterStyles.expanded]: expanded,
				[filterStyles.container]: true
			}),
		[expanded]
	);

	const filterIconClasses = useMemo(
		() =>
			classNames({
				expandedIcon: expanded,
				[filterStyles.icon]: true
			}),
		[expanded]
	);

	const listBoxClasses = useMemo(
		() =>
			classNames({
				[filterStyles.hasTags]: !!selected.length,
				[filterStyles.listbox]: true,
				[filterStyles.isKeyboard]: usedKeyboardLast
			}),
		[usedKeyboardLast, selected]
	);

	const filterTextClasses = useMemo(
		() =>
			classNames({
				[filterStyles.show]: shouldShowFilterMsg,
				[filterStyles.placeholder]: true
			}),
		[shouldShowFilterMsg]
	);

	const appliedStrClasses = useMemo(
		() =>
			classNames({
				[filterStyles.show]: !shouldShowFilterMsg,
				[filterStyles.appliedTags]: true
			}),
		[shouldShowFilterMsg]
	);

	return (
		<div className={containerClassName} ref={containerRef}>
			<div className={filterStyles.buttonContainer} ref={parentRef}>
				<span id="exp_elem" className="visually-hidden">
					Choose a tag to filter by:
				</span>
				<button
					ref={btnRef}
					className={filterStyles.filterButton}
					aria-haspopup="listbox"
					aria-labelledby="exp_elem filter-button"
					id="filter-button"
					{...buttonProps}
				>
					{<FilterIcon className={filterIconClasses} aria-hidden={true} />}
					<FilterDisplaySpan
						className={filterStyles.textContainer}
						heiight={currentSpanHeight}
						pose="initial"
						poseKey={currentSpanWidth}
						wiidth={currentSpanWidth}
					>
						<span
							ref={filterTextRef}
							aria-hidden={true}
							className={filterTextClasses}
						>
							Filters
						</span>
						<span
							ref={appliedFiltersTextRef}
							className={appliedStrClasses}
							style={{ maxWidth: maxSpanWidth }}
						>
							{appliedTagsStr}
						</span>
					</FilterDisplaySpan>
				</button>
				<ListIdBox
					id="listBoxID"
					role="listbox"
					ref={listBoxRef}
					className={listBoxClasses}
					aria-labelledby="exp_elem"
					tabIndex={-1}
					aria-multiselectable="true"
					aria-activedescendant={active && active.id}
					heiight={currentBtnHeight}
					poseKey={currentBtnHeight}
					pose={expanded ? "expanded" : "hidden"}
				>
					<div className={filterStyles.maxHeightHideContainer}>
						<div className={filterStyles.spacer} />
						{values.map((tag, index) => (
							<FilterListItem
								tag={tag}
								key={tag.id}
								index={index}
								expanded={expanded}
								selectIndex={selectIndex}
								active={active}
							/>
						))}
					</div>
				</ListIdBox>
			</div>

			<button
				aria-expanded="true"
				aria-haspopup="menu"
				id="button-befk28h8"
			></button>

			<div role="menu" aria-labelledby="button-befk28h8">
				<div role="menuitem" />
			</div>
		</div>
	);
};
