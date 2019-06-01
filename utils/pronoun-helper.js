const fs = require('fs');
const path = require('path');

const pronounIsFile = fs.readFileSync(path.join(__dirname, 'pronouns.tab'), 'utf8');

const pronoun2DArr = pronounIsFile
  .split('\n')
  .map(pronounRow => pronounRow.split('\t'));

/**
 * @param matchStr - The string to match to
 * @returns {[string, string, string, string, string]} authorInfo.pronouns - their preferred pronouns.
 *          Should match order of data here https://github.com/witch-house/pronoun.is
 */
const findPronouns = (matchStr) => {
  return pronoun2DArr.find(pronounList => pronounList.includes(matchStr));
}

/**
 * @typedef {object} socials
 * @prop {string} socials.twitter - Their Twitter handle, sans `@`
 */

/**
 * @typedef {object} authorInfo
 * @prop {string} authorInfo.username - The unique key to that user
 * @prop {string} authorInfo.name - Their name they wish to have displayed on the page
 * @prop {string} authorInfo.blurbet - The short form description of author, shown at the bottom of every page
 * @prop {string} authorInfo.description - The long form description of author
 * @prop {socials} authorInfo.socials - Their social media links
 * @prop {[string, string, string, string, string]} authorInfo.pronouns - their preferred pronouns.
 *       Should match order of data here https://github.com/witch-house/pronoun.is
 */

/**
 *
 * @type {authorInfo}
 */
module.exports = {
  pronoun2DArr,
  findPronouns
}
