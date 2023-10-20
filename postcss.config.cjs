// @ts-nocheck
const csso = require("postcss-csso");

module.exports = {
	// Restructure false, otherwise FFG site breaks
	plugins: [require("autoprefixer"), csso({ restructure: false })],
};
