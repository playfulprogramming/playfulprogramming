/**
 * @file export compiled ES modules as a workaround before Gatsby properly handles it
 * @see https://github.com/gatsbyjs/gatsby/discussions/31599
 */

const esm = require("esm");
const fs = require("fs");
const Module = require("module");

// Node: bypass [ERR_REQUIRE_ESM]
const orig = Module._extensions[".js"];
Module._extensions[".js"] = function (module, filename) {
	try {
		return orig(module, filename);
	} catch (e) {
		if (e.code === "ERR_REQUIRE_ESM") {
			const content = fs.readFileSync(filename, "utf8");
			module._compile(content, filename);
		}
	}
};

const _esmRequire = esm(module, {
	cjs: true,
	mode: "all",
});

// don't pollute Module
Module._extensions[".js"] = orig;

module.exports = function esmRequire(id) {
	return _esmRequire(id);
};
