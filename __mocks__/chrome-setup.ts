Object.defineProperties(window, {
	// To trick our href-container-script to pass actual functions
	inTestSuite: { value: true },
	plausible: { value: null },
});
