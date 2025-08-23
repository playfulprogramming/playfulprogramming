import { ComponentChildren } from "preact";
import style from "./resizeable-panels.module.scss";
import { useEffect, useRef, useState } from "preact/hooks";
import { HTMLAttributes } from "preact/compat";
import { tabletSmall } from "src/tokens/breakpoints";

interface ResizeablePanelsProps extends HTMLAttributes<HTMLDivElement> {
	panelHeight: number;
	leftPanel: ComponentChildren;
	rightPanel: ComponentChildren;
}

const isTabletSmall = import.meta.env.SSR
	? undefined
	: window.matchMedia(`(min-width: ${tabletSmall + 1}px)`);

export function ResizeablePanels({
	leftPanel,
	rightPanel,
	panelHeight,
	...props
}: ResizeablePanelsProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const leftPanelRef = useRef<HTMLDivElement | null>(null);
	const separatorRef = useRef<HTMLDivElement | null>(null);
	const [leftPanelWidth, setLeftPanelWidth] = useState<number | undefined>(
		undefined,
	);
	const [leftPanelHeight, setLeftPanelHeight] = useState<number | undefined>(
		undefined,
	);
	const [ariaValueNow, setAriaValueNow] = useState<number>(50);

	const [mouseDown, setMouseDown] = useState(false);

	function handleMouseDown(e: MouseEvent) {
		setMouseDown(true);
		e.preventDefault();
	}

	function handleMouseUp(_: MouseEvent) {
		setMouseDown(false);
	}

	function setPanelWidth(newWidth: number) {
		const containerEl = containerRef.current;
		if (!containerEl) return;
		const separatorEl = separatorRef.current;
		if (!separatorEl) return;

		const containerRect = containerEl.getBoundingClientRect();
		const separatorRect = separatorEl.getBoundingClientRect();

		const newLeftPanelWidth = Math.max(
			0,
			Math.min(containerRect.width - separatorRect.width, newWidth),
		);
		setAriaValueNow(
			(100 * newLeftPanelWidth) / (containerRect.width - separatorRect.width),
		);
		setLeftPanelWidth(newLeftPanelWidth);
	}

	function setPanelHeight(newHeight: number) {
		const containerEl = containerRef.current;
		if (!containerEl) return;
		const separatorEl = separatorRef.current;
		if (!separatorEl) return;

		const containerRect = containerEl.getBoundingClientRect();
		const separatorRect = separatorEl.getBoundingClientRect();

		const newLeftPanelHeight = Math.max(
			0,
			Math.min(containerRect.height - separatorRect.height, newHeight),
		);
		setAriaValueNow(
			(100 * newLeftPanelHeight) /
				(containerRect.height - separatorRect.height),
		);
		setLeftPanelHeight(newLeftPanelHeight);
	}

	function handleMouseMove(e: MouseEvent) {
		if (!mouseDown) return;
		const containerEl = containerRef.current;
		if (!containerEl) return;
		const separatorEl = separatorRef.current;
		if (!separatorEl) return;

		const containerRect = containerEl.getBoundingClientRect();
		const separatorRect = separatorEl.getBoundingClientRect();

		if (isTabletSmall?.matches) {
			setPanelWidth(e.clientX - containerRect.left - separatorRect.width / 2);
		} else {
			setPanelHeight(e.clientY - containerRect.top - separatorRect.height / 2);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		let change = 0;
		if (e.key == "ArrowLeft" || e.key == "ArrowUp") {
			change = -20;
		} else if (e.key == "ArrowRight" || e.key == "ArrowDown") {
			change = 20;
		} else {
			return;
		}

		const leftPanelEl = leftPanelRef.current;
		if (!leftPanelEl) return;

		const leftPanelRect = leftPanelEl.getBoundingClientRect();

		if (isTabletSmall?.matches) {
			setPanelWidth((leftPanelWidth ?? leftPanelRect.width) + change);
		} else {
			setPanelHeight((leftPanelHeight ?? leftPanelRect.height) + change);
		}

		e.preventDefault();
	}

	useEffect(() => {
		window.addEventListener("mouseup", handleMouseUp);
		return () => window.removeEventListener("mouseup", handleMouseUp);
	});

	useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	});

	return (
		<div
			ref={containerRef}
			class={style.container}
			style={{
				"--resizeable-panels-height": `${panelHeight}px`,
			}}
			data-mouse-down={mouseDown}
			{...props}
		>
			<div
				ref={leftPanelRef}
				class={style.leftPanel}
				style={{ width: leftPanelWidth, height: leftPanelHeight }}
				data-hidden={ariaValueNow < 15}
			>
				{leftPanel}
			</div>
			<div
				ref={separatorRef}
				role="separator"
				aria-valuenow={ariaValueNow}
				aria-orientation={isTabletSmall?.matches ? "vertical" : "horizontal"}
				class={style.separator}
				onMouseDown={handleMouseDown}
				onKeyDown={handleKeyDown}
				tabIndex={0}
			>
				<div class={style.separator__icon} />
			</div>
			<div class={style.rightPanel} data-hidden={ariaValueNow > 85}>{rightPanel}</div>
		</div>
	);
}
