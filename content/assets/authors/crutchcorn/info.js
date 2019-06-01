const { findPronouns } = require("../../../../utils/pronoun-helper");

module.exports = {
    name: 'Corbin Crutchley',
    blurbet: 'Is a cool dood',
    description: 'Is a super mega rad human being',
    socials: {
      twitter: 'crutchcorn'
    },
    pronouns: findPronouns('they')
};
