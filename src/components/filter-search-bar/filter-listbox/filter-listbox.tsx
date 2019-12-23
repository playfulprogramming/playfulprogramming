/**
 * This is a hand-spun component to match the guidelines for a listbox ALA w3 guidelines
 * @see https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
 *
 * ✅ Escape - Collapse the dropdown
 * ✅ Up - Focus previous item
 * ✅ Down - Focus next item
 * ✅ Home - Goes to first item
 * ✅ End - Goes to last item
 * ✅ Space - Toggles selection of item
 * ✅ Shift + Down - Focuses and selects next item
 * ✅ Shift + Up - Focuses and selects previous item
 * ✅ Ctrl + Shift + Home - Selects from the focused option to start of list
 * ✅ Ctrl + Shift + End - Selects from the focused option to end of list
 * ✅ Ctrl + A - Toggles selection of all
 * ✅ Click outside this component to close
 * ✅ Close on `blur`
 */

/**
 * "Filters"
 * Click to expand
 * Clicking filters won't do anything
 * After not expanded, show the filters by animating away "filters"
 * If nothing is selected, don't animate away "Filters"
 */

import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";
import classNames from "classnames";
import posed from "react-pose";

import filterStyles from "./filter-listbox.module.scss";

import FilterIcon from "../../../assets/icons/filter.svg";
import CheckIcon from "../../../assets/icons/check.svg";
import UncheckIcon from "../../../assets/icons/unchecked.svg";

import { usePopoverCombobox } from "../../../utils/a11y/usePopoverCombobox";
import { SearchAndFilterContext } from "../../search-and-filter-context";
import { useElementBounds } from "../../../utils";

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
			{tag.selected ? <CheckIcon /> : <UncheckIcon />}
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

export const FilterListbox = ({ tags = [], className }) => {
	const { setFilterVal } = useContext(SearchAndFilterContext);

	const {
		comboBoxListRef,
		active,
		values,
		selected,
		selectIndex,
		expanded,
		usedKeyboardLast,
		parentRef,
		buttonProps
	} = usePopoverCombobox(tags);

	// Set the selected array value to match the parent combobox
	useEffect(() => setFilterVal(selected), [selected, setFilterVal]);

	// Should it show the text "filter" or the selected text
	const shouldShowFilterMsg = expanded || !selected.length;

	// What should the selected text show
	const selectedString = useMemo(() => {
		if (!selected.length) return "";
		return selected.map(v => v.val).join(", ");
	}, [selected]);

	/**
	 * Refs
	 */
	// Set the node reference for the button for focusing
	const [buttonNode, setButtonNode] = useState();
	// Get a callback reference to get the element bounds
	const {
		ref: elBoundsCBRef,
		val: { height: buttonHeight }
	} = useElementBounds([]);
	// Create a callback reference to compose both the callback bound ref and the "real" ref
	const btnCallbackRef = useCallback(
		node => {
			elBoundsCBRef(node);
			setButtonNode(node);
		},
		[elBoundsCBRef, setButtonNode]
	);

	/**
	 * Effects
	 */
	useEffect(() => {
		// When user escapes using "Esc" key, refocus on btn
		if (!expanded && usedKeyboardLast && buttonNode) {
			buttonNode.focus();
		}
	}, [expanded, usedKeyboardLast, buttonNode]);

	/**
	 * The bounding box handlers
	 */
	// Get the width of just displaying "Filter"
	const {
		ref: getFilterStrWidthFromRef,
		val: { width: filterStrWidth, height: filterStrHeight }
	} = useElementBounds([]);
	// Get the width of the "selected" value string in order to set the box
	// width to it for an animation effect
	const {
		ref: getSelectedStrWidthFromRef,
		val: { width: selectedStrWidth }
	} = useElementBounds([selected]);
	// Get the top level container width so we can set it as a max width for the
	// selected string span so we can cut it with `...` properly
	const {
		ref: getContainerWidthFromRef,
		val: { width: topLevelContainerWidth }
	} = useElementBounds([]);

	// Set that max width value mentioned above but add some padding for the btn
	const maxSelectedStrWidth = `${topLevelContainerWidth - 72}px`;

	const filterContentsWidth =
		// If there is nothing selected, then it should be the width of the filter str
		shouldShowFilterMsg
			? // If it's expanded, let's add some breathing room of 100px to see the filters
			  expanded
				? filterStrWidth + 100
				: filterStrWidth
			: selectedStrWidth;

	/**
	 * Classes
	 */
	const containerClassName = classNames({
		[filterStyles.expanded]: expanded,
		[filterStyles.container]: true,
		[className || ""]: true
	});

	const filterTextClasses = classNames({
		[filterStyles.show]: shouldShowFilterMsg,
		[filterStyles.placeholder]: true
	});

	const filterIconClasses = classNames({
		expandedIcon: expanded,
		[filterStyles.icon]: true
	});

	const listBoxClasses = classNames({
		[filterStyles.hasTags]: !!selected.length,
		[filterStyles.listbox]: true,
		[filterStyles.isKeyboard]: usedKeyboardLast
	});

	const appliedStrClasses = classNames({
		[filterStyles.show]: !shouldShowFilterMsg,
		[filterStyles.appliedTags]: true
	});

	return (
		<div className={containerClassName} ref={getContainerWidthFromRef}>
			<div className={filterStyles.buttonContainer} ref={parentRef}>
				<span id="exp_elem" className="visually-hidden">
					Choose a tag to filter by:
				</span>
				<button
					type="button"
					className={filterStyles.filterButton}
					aria-haspopup="listbox"
					aria-expanded={expanded}
					aria-labelledby="exp_elem filter-button"
					aria-owns="listBoxID"
					id="filter-button"
					ref={btnCallbackRef}
					{...buttonProps}
				>
					{<FilterIcon className={filterIconClasses} aria-hidden={true} />}
					<FilterDisplaySpan
						className={filterStyles.textContainer}
						pose="initial"
						heiight={filterStrHeight}
						poseKey={filterContentsWidth}
						wiidth={filterContentsWidth}
					>
						<span
							aria-hidden={true}
							ref={getFilterStrWidthFromRef}
							className={filterTextClasses}
						>
							Filters
						</span>
						<span
							aria-hidden={true}
							ref={getSelectedStrWidthFromRef}
							className={appliedStrClasses}
							style={{
								maxWidth: maxSelectedStrWidth
							}}
						>
							{selectedString}
						</span>
					</FilterDisplaySpan>
				</button>
				<ListIdBox
					id="listBoxID"
					role="listbox"
					ref={comboBoxListRef}
					className={listBoxClasses}
					aria-labelledby="exp_elem"
					tabIndex={0}
					aria-multiselectable="true"
					aria-activedescendant={active && active.id}
					heiight={buttonHeight}
					poseKey={buttonHeight}
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
		</div>
	);
};
