import "@testing-library/jest-dom/vitest";
import { afterEach } from "ui-test-utils";
import { cleanup } from "@testing-library/preact";

Object.defineProperties(window, {
	// To trick our href-container-script to pass actual functions
	inTestSuite: { value: true },
	plausible: { value: null },
});

afterEach(() => cleanup());
