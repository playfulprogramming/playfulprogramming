const { lstatSync, readdirSync } = require('fs')
const { join, basename } = require('path')

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)

const authorFolders = getDirectories(join(__dirname, 'content', 'assets', 'authors'))

/**
 * @typedef {object} socials
 * @prop {string} socials.twitter - Their Twitter handle, sans `@`
 */

/**
 * @typedef {object} authorInfo
 * @prop {string} authorInfo.name - Their name they wish to have displayed on the page
 * @prop {string} authorInfo.blurbet - The short form description of author, shown at the bottom of every page
 * @prop {string} authorInfo.description - The long form description of author
 * @prop {socials} authorInfo.socials - Their social media links
 * @prop {[string, string, string, string, string]} authorInfo.pronouns - their preferred pronouns.
 *       Should match order of data here https://github.com/witch-house/pronoun.is
 */

/**
 *
 * @type {{[username: string]: authorInfo}}
 */
module.exports = authorFolders.reduce((prev, folder) => {
  const username = basename(folder);
  prev[username] = require(join(folder, 'info'));
  return prev;
}, {})
