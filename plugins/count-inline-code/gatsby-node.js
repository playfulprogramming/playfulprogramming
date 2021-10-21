const esmRequire = require("../../esmRequire");
const { resolve } = require("path");

module.exports = esmRequire(resolve(__dirname, "./gatsby-node-esm"));
