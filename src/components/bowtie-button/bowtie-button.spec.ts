import { readFileSync, readdirSync } from "node:fs";
import { gzipSync } from "node:zlib";

import { JSDOM } from "jsdom";
import { afterEach, describe, expect, it, vi } from "vitest";

const ANIM_DURATION_MS = 300;
const FRAME_INTERVALS = 9;
const BOWTIE_SPRITE_URL = "/bowtie-button-demo/assets/bowtie-frames.svg";
const MAX_RUNTIME_GZIP_BYTES = 2_100;

const productionScript = readFileSync("script.js", "utf8");
const styles = readFileSync("styles.css", "utf8");
const html = readFileSync("index.html", "utf8");
const sprite = readFileSync("assets/bowtie-frames.svg", "utf8");

// squish, rotation, bow scale, bow opacity, dot scale, dot fill
const EXPECTED_SPRITE_FRAMES = [
	["1", null, "0.4167", "0", "4", "#006590"],
	[
		"1.0477",
		"-5.412119421498073",
		"0.444",
		"0.1751682975396242",
		"3.7921345603796697",
		"#0c6d97",
	],
	[
		"1.1842",
		"-28.902769094037993",
		"0.5627",
		"0.6952348396452721",
		"2.8590526719596374",
		"#2e83a9",
	],
	[
		"1.3764",
		"-75.4465370697838",
		"0.7977",
		"0.9207757834293515",
		"1.9546907958212003",
		"#5da1c3",
	],
	[
		"1.5765",
		"-114.7137485414699",
		"0.9961",
		"0.9929626732598482",
		"1.5216257939763609",
		"#8dc0de",
	],
	[
		"1.7461",
		"-138.12672167542237",
		"1.1143",
		null,
		"1.3228498621384226",
		"#b4d9f4",
	],
	[
		"1.8689",
		"-151.928004265843",
		"1.184",
		null,
		"1.2533713043908152",
		"#c7e5fe",
	],
	["1.9466", "-159.85056626515922", "1.224", null, "1.25", "#c8e6ff"],
	["1.9876", "-163.83884108787495", "1.2442", null, "1.25", "#c8e6ff"],
	["2", "-165", "1.25", null, "1.25", "#c8e6ff"],
];

const cleanups = [];

afterEach(() => {
	while (cleanups.length) cleanups.pop()();
});

function dispatch(windowRef, target, type, properties = {}) {
	const event = new windowRef.Event(type, { bubbles: true, cancelable: true });
	for (const [name, value] of Object.entries(properties)) {
		Object.defineProperty(event, name, { configurable: true, value });
	}
	target.dispatchEvent(event);
	return event;
}

function createHarness({ pointerCaptureThrows = false } = {}) {
	const dom = new JSDOM(
		`<!doctype html>
      <button class="bowtie-button">
        Test button
        <div class="bowtie-visibility"><div class="bowties"></div></div>
      </button>`,
		{ runScripts: "outside-only", url: "http://localhost/" },
	);
	cleanups.push(() => dom.window.close());

	const { window } = dom;
	const { document } = window;
	const button = document.querySelector(".bowtie-button");
	const bowties = button.querySelector(".bowties");
	const timeline = {};
	Object.defineProperty(document, "timeline", {
		configurable: true,
		value: timeline,
	});

	const setPointerCapture = vi.fn((pointerId) => {
		if (pointerCaptureThrows)
			throw new Error(`Cannot capture pointer ${pointerId}`);
	});
	button.setPointerCapture = setPointerCapture;

	let clock = 0;
	let nextRafId = 1;
	const pendingFrames = new Map();
	const animation = {
		currentTime: null,
		cancel: vi.fn(() => {
			animation.currentTime = null;
		}),
	};
	const requestFrame = vi.fn((callback) => {
		const id = nextRafId;
		nextRafId += 1;
		pendingFrames.set(id, callback);
		return id;
	});
	const cancelFrame = vi.fn((id) => pendingFrames.delete(id));
	const KeyframeEffect = vi.fn(
		function FakeKeyframeEffect(target, keyframes, timing) {
			this.target = target;
			this.keyframes = keyframes;
			this.timing = timing;
		},
	);
	const Animation = vi.fn((effect, animationTimeline) => {
		animation.effect = effect;
		animation.timeline = animationTimeline;
		return animation;
	});

	Object.defineProperty(window.performance, "now", {
		configurable: true,
		value: () => clock,
	});
	Object.defineProperties(window, {
		Animation: { configurable: true, value: Animation },
		KeyframeEffect: { configurable: true, value: KeyframeEffect },
		requestAnimationFrame: { configurable: true, value: requestFrame },
		cancelAnimationFrame: { configurable: true, value: cancelFrame },
	});

	// Execute the exact production file as a black box. No exports, dependency injection, or teardown
	// hooks are added to the shipped code for the test suite.
	window.eval(`"use strict";\n${productionScript}\n//# sourceURL=script.js`);

	function setTime(timestamp) {
		clock = timestamp;
	}

	function flushFrame(
		performanceTimestamp = clock,
		rafTimestamp = performanceTimestamp,
	) {
		clock = performanceTimestamp;
		const callbacks = [...pendingFrames.values()];
		pendingFrames.clear();
		for (const callback of callbacks) callback(rafTimestamp);
	}

	function pointerDown(pointerId = 1, mouseButton = 0) {
		dispatch(window, button, "pointerdown", { pointerId, button: mouseButton });
	}

	function pointerUp(pointerId = 1) {
		dispatch(window, document, "pointerup", { pointerId });
	}

	function pointerCancel(pointerId = 1) {
		dispatch(window, document, "pointercancel", { pointerId });
	}

	function losePointerCapture(pointerId = 1) {
		dispatch(window, button, "lostpointercapture", { pointerId });
	}

	function keyDown(key, code = key === " " ? "Space" : key) {
		dispatch(window, button, "keydown", { key, code });
	}

	function keyUp(key, code = key === " " ? "Space" : key) {
		dispatch(window, document, "keyup", { key, code });
	}

	function blur() {
		dispatch(window, window, "blur");
	}

	function hideDocument() {
		Object.defineProperty(document, "hidden", {
			configurable: true,
			value: true,
		});
		dispatch(window, document, "visibilitychange");
	}

	function renderedFrame() {
		const match = bowties.style.backgroundImage.match(/#frame(\d+)/);
		return match ? Number(match[1]) : 0;
	}

	function expectSynchronized() {
		if (animation.currentTime === null) {
			expect(renderedFrame()).toBe(0);
			return;
		}

		const expectedFrame = Math.min(
			FRAME_INTERVALS,
			Math.floor((animation.currentTime / ANIM_DURATION_MS) * FRAME_INTERVALS),
		);
		expect(renderedFrame()).toBe(expectedFrame);
	}

	return {
		Animation,
		KeyframeEffect,
		animation,
		blur,
		bowties,
		button,
		cancelFrame,
		document,
		expectSynchronized,
		flushFrame,
		hideDocument,
		keyDown,
		keyUp,
		losePointerCapture,
		pendingCount: () => pendingFrames.size,
		pointerCancel,
		pointerDown,
		pointerUp,
		renderedFrame,
		requestFrame,
		setPointerCapture,
		setTime,
		timeline,
		window,
	};
}

describe("production bundle contract", () => {
	it("keeps all test seams out of the shipped JavaScript", () => {
		const normalizedScript = productionScript.replace(/\r\n/g, "\n");
		const loadedScripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(
			(match) => match[1],
		);

		expect(loadedScripts).toEqual(["/bowtie-button-demo/script.js"]);
		expect(productionScript).not.toMatch(/^\s*(?:import|export)\s/m);
		expect(readdirSync(".")).not.toContain("bowtie-button.js");
		expect(
			gzipSync(normalizedScript, { level: 9 }).byteLength,
		).toBeLessThanOrEqual(MAX_RUNTIME_GZIP_BYTES);
	});
});

describe("sprite contract", () => {
	it("keeps the square frame0 CSS contract intact", () => {
		expect(styles).toContain(
			`background-image: url('${BOWTIE_SPRITE_URL}#frame0')`,
		);
		expect(styles).toContain("background-size: 8px 8px");
	});

	it("packages the exact ten frame states into one compact SVG sprite", () => {
		const parserDom = new JSDOM("");
		const spriteDocument = new parserDom.window.DOMParser().parseFromString(
			sprite,
			"image/svg+xml",
		);
		parserDom.window.close();

		expect(spriteDocument.querySelector("parsererror")).toBeNull();
		const views = [...spriteDocument.querySelectorAll("view")];
		expect(
			views.map((view) => [view.id, view.getAttribute("viewBox")]),
		).toEqual(
			Array.from({ length: 10 }, (_, frame) => [
				`frame${frame}`,
				`${frame * 48} 0 48 48`,
			]),
		);

		const ids = [...spriteDocument.querySelectorAll("[id]")].map(
			(element) => element.id,
		);
		expect(new Set(ids).size).toBe(ids.length);
		expect(spriteDocument.querySelectorAll("use")).toHaveLength(20);

		const frameGroups = [...spriteDocument.documentElement.children].filter(
			(element) => element.tagName === "g",
		);
		expect(frameGroups).toHaveLength(EXPECTED_SPRITE_FRAMES.length);
		for (const [frame, expected] of EXPECTED_SPRITE_FRAMES.entries()) {
			const [squish, angle, bowScale, opacity, dotScale, dotFill] = expected;
			const frameGroup = frameGroups[frame];
			const squishGroup = frameGroup.firstElementChild;
			const rotationGroup = squishGroup.children[0];
			const bow = rotationGroup.firstElementChild;
			const dot = squishGroup.children[1];
			const rotate = angle === null ? "" : `rotate(${angle} 24 24) `;

			expect(frameGroup.getAttribute("transform")).toBe(
				`translate(${frame * 48} 0)`,
			);
			expect(squishGroup.getAttribute("transform")).toBe(
				`translate(24 24) scale(1 ${squish}) translate(-24 -24)`,
			);
			expect(rotationGroup.getAttribute("transform")).toBe(
				`${rotate}translate(24 24) scale(${bowScale} ${bowScale}) translate(-24 -24)`,
			);
			expect(bow.getAttribute("href")).toBe("#bow-shape");
			expect(bow.getAttribute("fill-opacity")).toBe(opacity);
			expect(dot.getAttribute("href")).toBe("#dot-shape");
			expect(dot.getAttribute("transform")).toBe(
				`translate(24 24) scale(${dotScale} ${dotScale}) translate(-24 -24)`,
			);
			expect(dot.getAttribute("fill")).toBe(dotFill);
		}

		expect(
			readdirSync("assets").filter((file) => /^frame\d+\.svg$/.test(file)),
		).toEqual([]);
		expect(html).not.toMatch(/assets\/frame\d+\.svg/);
		expect(gzipSync(sprite, { level: 9 }).byteLength).toBeLessThan(9_506 / 4);
	});
});

describe("bowtie press animation", () => {
	it("constructs the intended scale and fade effect on the document timeline", () => {
		const harness = createHarness();

		expect(harness.KeyframeEffect).toHaveBeenCalledWith(
			harness.bowties,
			[
				{ transform: "scale(1, 1)", opacity: 1 },
				{ transform: "scale(4, 2)", opacity: 0.24 },
			],
			{ duration: 300, easing: "ease-in-out", fill: "both" },
		);
		expect(harness.Animation).toHaveBeenCalledWith(
			expect.objectContaining({ target: harness.bowties }),
			harness.timeline,
		);
	});

	it("reaches frame9 and the exact animation endpoint on a full hold", () => {
		const harness = createHarness();

		harness.pointerDown();
		expect(harness.animation.currentTime).toBe(0);
		expect(harness.pendingCount()).toBe(1);

		harness.flushFrame(100);
		expect(harness.animation.currentTime).toBe(100);
		expect(harness.renderedFrame()).toBe(3);
		harness.expectSynchronized();

		harness.flushFrame(300);
		expect(harness.animation.currentTime).toBe(300);
		expect(harness.renderedFrame()).toBe(9);
		expect(harness.pendingCount()).toBe(0);
		expect(harness.animation.cancel).not.toHaveBeenCalled();
	});

	it("maps every animation frame to a fragment of the same sprite", () => {
		const harness = createHarness();
		const frameTimes = [34, 67, 100, 134, 167, 200, 234, 267, 300];
		const spriteUrls = [];

		harness.pointerDown();
		for (const [index, timestamp] of frameTimes.entries()) {
			const frame = index + 1;
			harness.flushFrame(timestamp);
			expect(harness.renderedFrame()).toBe(frame);
			expect(harness.bowties.style.backgroundImage).toContain(
				`${BOWTIE_SPRITE_URL}#frame${frame}`,
			);
			spriteUrls.push(harness.bowties.style.backgroundImage.split("#")[0]);
		}

		expect(new Set(spriteUrls).size).toBe(1);
		expect(harness.pendingCount()).toBe(0);
	});

	it("snaps fractional steps to the exact forward and reverse endpoints", () => {
		const harness = createHarness();

		harness.pointerDown();
		for (let step = 1; step <= 6; step += 1) harness.flushFrame(step * 50);
		expect(harness.animation.currentTime).toBe(300);
		expect(harness.renderedFrame()).toBe(9);
		expect(harness.pendingCount()).toBe(0);

		harness.pointerUp();
		for (let step = 1; step <= 6; step += 1)
			harness.flushFrame(300 + step * 50);
		expect(harness.animation.currentTime).toBeNull();
		expect(harness.renderedFrame()).toBe(0);
		expect(harness.pendingCount()).toBe(0);
	});

	it("fully unwinds, clears inline frame state, and starts cleanly again", () => {
		const harness = createHarness();

		harness.pointerDown();
		harness.flushFrame(300);
		harness.pointerUp();
		harness.flushFrame(450);
		expect(harness.animation.currentTime).toBe(150);
		expect(harness.renderedFrame()).toBe(4);

		harness.flushFrame(600);
		expect(harness.animation.currentTime).toBeNull();
		expect(harness.bowties.style.backgroundImage).toBe("");
		expect(harness.pendingCount()).toBe(0);
		expect(harness.animation.cancel).toHaveBeenCalledTimes(1);

		harness.pointerDown(2);
		expect(harness.animation.currentTime).toBe(0);
		harness.flushFrame(650);
		expect(harness.animation.currentTime).toBe(50);
		expect(harness.renderedFrame()).toBe(1);
		harness.expectSynchronized();
	});

	it("settles elapsed time in the old direction before a rapid reversal", () => {
		const harness = createHarness();

		harness.pointerDown();
		harness.setTime(120);
		harness.pointerUp();
		expect(harness.animation.currentTime).toBe(120);
		expect(harness.renderedFrame()).toBe(3);

		harness.setTime(150);
		harness.pointerDown();
		expect(harness.animation.currentTime).toBeCloseTo(90);
		expect(harness.renderedFrame()).toBe(2);
		expect(harness.pendingCount()).toBe(1);

		harness.flushFrame(180);
		expect(harness.animation.currentTime).toBeCloseTo(120);
		expect(harness.renderedFrame()).toBe(3);
		harness.expectSynchronized();
	});

	it("samples performance.now instead of a stale RAF callback timestamp", () => {
		const harness = createHarness();

		harness.pointerDown();
		harness.setTime(29);
		harness.pointerUp();
		expect(harness.animation.currentTime).toBe(29);

		harness.flushFrame(32, 28);
		expect(harness.animation.currentTime).toBe(26);
		harness.flushFrame(48, 44);
		expect(harness.animation.currentTime).toBe(10);
		harness.expectSynchronized();
	});

	it("survives rapid reversals interleaved with animation frames", () => {
		const harness = createHarness();

		function expectTime(expectedTime) {
			expect(harness.animation.currentTime).toBeCloseTo(expectedTime);
			expect(harness.pendingCount()).toBe(1);
			harness.expectSynchronized();
		}

		harness.pointerDown();
		harness.flushFrame(16);
		expectTime(16);

		harness.setTime(29);
		harness.pointerUp();
		expectTime(29);
		harness.flushFrame(32);
		expectTime(26);

		harness.setTime(40);
		harness.pointerDown();
		expectTime(18);
		harness.flushFrame(64);
		expectTime(42);

		harness.setTime(69);
		harness.pointerUp();
		expectTime(47);
		harness.setTime(80);
		harness.pointerDown();
		expectTime(36);
		harness.flushFrame(96);
		expectTime(52);

		harness.setTime(109);
		harness.pointerUp();
		expectTime(65);
		harness.flushFrame(112);
		expectTime(62);
		harness.setTime(120);
		harness.pointerDown();
		expectTime(54);
		harness.flushFrame(128);
		expectTime(62);

		harness.setTime(149);
		harness.pointerUp();
		expectTime(83);
		harness.flushFrame(160);
		expectTime(72);
		harness.pointerDown();
		expectTime(72);
		harness.flushFrame(176);
		expectTime(88);

		harness.setTime(189);
		harness.pointerUp();
		expectTime(101);
		harness.flushFrame(304);
		expect(harness.animation.currentTime).toBeNull();
		expect(harness.renderedFrame()).toBe(0);
		expect(harness.pendingCount()).toBe(0);
	});

	it("survives dense press bursts with one RAF and synchronized frames", () => {
		const harness = createHarness();
		let time = 0;

		harness.pointerDown();
		for (let cycle = 0; cycle < 24; cycle += 1) {
			time += 29;
			harness.setTime(time);
			harness.pointerUp();
			expect(harness.pendingCount()).toBeLessThanOrEqual(1);
			harness.expectSynchronized();

			time += 11;
			harness.setTime(time);
			harness.pointerDown();
			expect(harness.pendingCount()).toBeLessThanOrEqual(1);
			harness.expectSynchronized();
		}

		time += 29;
		harness.setTime(time);
		harness.pointerUp();
		harness.flushFrame(time + ANIM_DURATION_MS);

		expect(harness.animation.currentTime).toBeNull();
		expect(harness.renderedFrame()).toBe(0);
		expect(harness.pendingCount()).toBe(0);
	});

	it("cancels the queued RAF on an immediate release", () => {
		const harness = createHarness();

		harness.pointerDown();
		expect(harness.pendingCount()).toBe(1);
		harness.pointerUp();

		expect(harness.animation.currentTime).toBeNull();
		expect(harness.pendingCount()).toBe(0);
		expect(harness.cancelFrame).toHaveBeenCalledTimes(1);
		expect(harness.bowties.style.backgroundImage).toBe("");

		harness.flushFrame(500);
		expect(harness.animation.currentTime).toBeNull();
		expect(harness.pendingCount()).toBe(0);
	});

	it("waits for every active pointer before reversing", () => {
		const harness = createHarness();

		harness.pointerDown(1);
		harness.setTime(10);
		harness.pointerDown(2);
		harness.flushFrame(80);
		expect(harness.animation.currentTime).toBe(80);

		harness.pointerUp(1);
		harness.flushFrame(100);
		expect(harness.animation.currentTime).toBe(100);

		harness.pointerUp(2);
		harness.flushFrame(120);
		expect(harness.animation.currentTime).toBe(80);
		expect(harness.setPointerCapture).toHaveBeenCalledTimes(2);
		harness.expectSynchronized();
	});

	it("does not let pointer, keyboard, repeat, or unrelated key events release each other", () => {
		const harness = createHarness();

		harness.pointerDown();
		harness.setTime(20);
		harness.keyDown("Enter");
		harness.keyDown("Enter");
		harness.flushFrame(100);
		expect(harness.animation.currentTime).toBe(100);

		harness.pointerUp();
		harness.flushFrame(140);
		expect(harness.animation.currentTime).toBe(140);

		harness.keyUp("Escape");
		harness.flushFrame(160);
		expect(harness.animation.currentTime).toBe(160);

		harness.keyUp("Enter");
		harness.flushFrame(190);
		expect(harness.animation.currentTime).toBe(130);
		harness.expectSynchronized();
	});

	it("waits for both activation keys before reversing", () => {
		const harness = createHarness();

		harness.keyDown("Enter");
		harness.setTime(20);
		harness.keyDown(" ");
		harness.flushFrame(100);
		expect(harness.animation.currentTime).toBe(100);

		harness.keyUp("Enter");
		harness.flushFrame(140);
		expect(harness.animation.currentTime).toBe(140);

		harness.keyUp(" ");
		harness.flushFrame(170);
		expect(harness.animation.currentTime).toBeCloseTo(110);
		harness.expectSynchronized();
	});

	it("handles cancellation, lost capture, blur, and hidden documents", () => {
		const harness = createHarness();

		harness.pointerDown(1);
		harness.setTime(60);
		harness.pointerCancel(1);
		expect(harness.animation.currentTime).toBe(60);
		harness.flushFrame(120);
		expect(harness.animation.currentTime).toBeNull();

		harness.pointerDown(2);
		harness.setTime(170);
		harness.losePointerCapture(2);
		expect(harness.animation.currentTime).toBe(50);
		harness.flushFrame(220);
		expect(harness.animation.currentTime).toBeNull();

		harness.pointerDown(3);
		harness.keyDown(" ");
		harness.setTime(280);
		harness.blur();
		expect(harness.animation.currentTime).toBe(60);
		harness.flushFrame(340);
		expect(harness.animation.currentTime).toBeNull();

		harness.pointerDown(4);
		harness.setTime(380);
		harness.hideDocument();
		expect(harness.animation.currentTime).toBe(40);
		harness.flushFrame(420);
		expect(harness.animation.currentTime).toBeNull();
	});

	it("ignores non-primary clicks and falls back when pointer capture throws", () => {
		const harness = createHarness({ pointerCaptureThrows: true });

		harness.pointerDown(1, 2);
		expect(harness.pendingCount()).toBe(0);
		expect(harness.setPointerCapture).not.toHaveBeenCalled();

		harness.pointerDown(2);
		expect(harness.pendingCount()).toBe(1);
		expect(harness.setPointerCapture).toHaveBeenCalledWith(2);

		harness.setTime(50);
		harness.pointerUp(2);
		harness.flushFrame(100);
		expect(harness.animation.currentTime).toBeNull();
		expect(harness.pendingCount()).toBe(0);
	});
});
