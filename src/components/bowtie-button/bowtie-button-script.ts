const animDurationMs = 300;
// The final frame is frame9, so there are nine intervals between frame0 and frame9.
const frameIntervals = 9;

const el = document.querySelector<HTMLLinkElement>("#bowtie-button");
if (!el) throw new Error("Missing #bowtie-button element");

const bowties = el.querySelector<HTMLElement>("[data-bowtie]")!;
if (!bowties) throw new Error("Missing [data-bowtie] element");

const root = document.documentElement;
const animationDisabledAttribute = "data-bowtie-animation-disabled";

function hasDefaultBackground() {
	const styles = getComputedStyle(root);
	const primaryHue = styles.getPropertyValue("--hue-primary").trim();
	const defaultPrimaryHue = styles.getPropertyValue("--pfp-hue-primary").trim();

	return (
		primaryHue !== "" &&
		defaultPrimaryHue !== "" &&
		Number(primaryHue) === Number(defaultPrimaryHue)
	);
}

let animationEnabled = hasDefaultBackground();
el.toggleAttribute(animationDisabledAttribute, !animationEnabled);

// The scale is deliberately non-uniform: it tightens the vertical tile spacing, and each frame SVG
// pre-stretches its artwork to match so the bowties stay un-squished. See assets/README.md.
//
// This effect never plays on its own. A single requestAnimationFrame loop seeks it and swaps the SVG
// frame from the same progress value, so rapid direction changes cannot leave two clocks out of step.
const press = new Animation(
	new KeyframeEffect(
		bowties,
		[
			{ transform: "scale(1, 1)", opacity: 1 },
			{ transform: "scale(4, 2)", opacity: 0.24 },
		],
		{ duration: animDurationMs, easing: "ease-in-out", fill: "both" },
	),
	document.timeline,
);

let progress = 0;
let targetProgress = 0;
let previousTimestamp: number | null = null;
let rafId: number | null = null;
let renderedFrame = 0;
let renderedDarkMode = root.classList.contains("dark");

function frameUrl(frameNum: number, darkMode: boolean) {
	const frameId = `${darkMode ? "dark-" : ""}frame${frameNum}`;
	return `url("/animations/bowtie-frames.svg#${frameId}")`;
}

function render() {
	press.currentTime = progress * animDurationMs;

	const frameNum = Math.min(
		frameIntervals,
		Math.floor(progress * frameIntervals),
	);
	const darkMode = root.classList.contains("dark");
	if (frameNum === renderedFrame && darkMode === renderedDarkMode) return;

	renderedFrame = frameNum;
	renderedDarkMode = darkMode;
	bowties.style.backgroundImage = frameUrl(frameNum, darkMode);
}

// Theme changes can happen while the animation is held on its final frame, after its RAF loop has
// stopped. Keep the current frame in sync with color mode, and use the static button treatment when
// the primary color no longer matches the artwork's default background.
new MutationObserver(() => {
	const nextAnimationEnabled = hasDefaultBackground();
	if (nextAnimationEnabled !== animationEnabled) {
		animationEnabled = nextAnimationEnabled;
		el.toggleAttribute(animationDisabledAttribute, !animationEnabled);
		syncPressedState();
	}

	const darkMode = root.classList.contains("dark");
	if (darkMode === renderedDarkMode) return;
	renderedDarkMode = darkMode;
	bowties.style.backgroundImage = frameUrl(renderedFrame, darkMode);
}).observe(root, {
	attributes: true,
	attributeFilter: ["class", "style"],
});

function advance(timestamp: number) {
	if (previousTimestamp === null) return;

	const elapsedProgress =
		Math.max(0, timestamp - previousTimestamp) / animDurationMs;
	progress =
		targetProgress === 1
			? Math.min(targetProgress, progress + elapsedProgress)
			: Math.max(targetProgress, progress - elapsedProgress);
	if (Math.abs(progress - targetProgress) < 1e-12) progress = targetProgress;
	previousTimestamp = timestamp;
}

function finishAtTarget() {
	if (rafId !== null) cancelAnimationFrame(rafId);
	previousTimestamp = null;
	rafId = null;

	if (targetProgress !== 0) return;

	// Once the press has fully unwound, hand opacity back to the CSS hover rule and let the stylesheet
	// own frame0 again. Canceling before this boundary is what used to expose an unsynchronised frame.
	press.cancel();
	bowties.style.removeProperty("background-image");
	renderedFrame = 0;
	renderedDarkMode = root.classList.contains("dark");
}

function tick() {
	// Event handlers also use performance.now(); keeping every sample on that clock prevents a RAF
	// timestamp from moving previousTimestamp backwards around a rapid reversal.
	advance(performance.now());
	render();

	if (progress === targetProgress) {
		finishAtTarget();
		return;
	}

	rafId = requestAnimationFrame(tick);
}

function setPressed(isPressed: boolean) {
	const nextTarget = isPressed ? 1 : 0;
	if (nextTarget === targetProgress) return;

	const timestamp = performance.now();
	// Account for time since the last paint in the old direction before reversing. This makes a rapid
	// release/re-press continuous even when both events land between animation frames.
	advance(timestamp);
	targetProgress = nextTarget;
	previousTimestamp = timestamp;
	render();

	if (progress === targetProgress) {
		finishAtTarget();
		return;
	}

	if (rafId === null) rafId = requestAnimationFrame(tick);
}

const activePointers = new Set<number>();
const activeKeys = new Set<string>();

function syncPressedState() {
	setPressed(
		animationEnabled && (activePointers.size > 0 || activeKeys.size > 0),
	);
}

el.addEventListener("pointerdown", (event) => {
	if (event.button !== 0) return;

	activePointers.add(event.pointerId);
	try {
		el.setPointerCapture(event.pointerId);
	} catch {
		// The persistent document listeners below are also a fallback when capture is unavailable.
	}
	syncPressedState();
});

function releasePointer(event: PointerEvent) {
	if (!activePointers.delete(event.pointerId)) return;
	syncPressedState();
}

document.addEventListener("pointerup", releasePointer, true);
document.addEventListener("pointercancel", releasePointer, true);
el.addEventListener("lostpointercapture", releasePointer);

function isActivationKey(event: KeyboardEvent) {
	return event.key === "Enter" || event.key === " ";
}

function keyId(event: KeyboardEvent) {
	return event.code || event.key;
}

el.addEventListener("keydown", (event) => {
	if (!isActivationKey(event)) return;

	activeKeys.add(keyId(event));
	syncPressedState();
});

document.addEventListener(
	"keyup",
	(event) => {
		if (!isActivationKey(event) || !activeKeys.delete(keyId(event))) return;
		syncPressedState();
	},
	true,
);

function releaseAllInputs() {
	if (activePointers.size === 0 && activeKeys.size === 0) return;

	activePointers.clear();
	activeKeys.clear();
	syncPressedState();
}

window.addEventListener("blur", releaseAllInputs);
document.addEventListener("visibilitychange", () => {
	if (document.hidden) releaseAllInputs();
});
