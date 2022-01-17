const getSiteUrlAndBuildMode = require("./src/constants/site-url");

const { siteUrl, buildMode } = getSiteUrlAndBuildMode();

module.exports = {
  siteUrl,
  sourceDir: ".next",
  generateRobotsTxt: true,
  ...(buildMode === "production"
    ? {}
    : {
        robotsTxtOptions: {
          policies: [{ userAgent: "*", disallow: "/" }],
        },
      }),
};
