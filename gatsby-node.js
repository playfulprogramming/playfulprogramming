'use strict'

require('source-map-support').install()
require('ts-node').register({
	compilerOptions: {
		module: 'commonjs',
		target: 'es2017',
	},
})

exports.onCreateNode = require('./config/gatsby/gatsbyNode').onCreateNode
exports.sourceNodes = require('./config/gatsby/gatsbyNode').sourceNodes
exports.createPages = require('./config/gatsby/gatsbyNode').createPages
