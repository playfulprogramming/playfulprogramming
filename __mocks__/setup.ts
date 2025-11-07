import "@testing-library/jest-dom/vitest";
import * as preact from "preact";

Object.defineProperties(globalThis, {
	// To trick our href-container-script to pass actual functions
	inTestSuite: { value: true },
	plausible: { value: null },
	React: { value: preact },
});
