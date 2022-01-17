module.exports = () => {
  const buildMode = process.env.BUILD_ENV || "production";
  let siteUrl = process.env.SITE_URL || process.env.VERCEL_URL || "";

  if (!siteUrl) {
    switch (buildMode) {
      case "production":
        siteUrl = "https://unicorn-utterances.com";
        break;
      case "development":
        siteUrl = "localhost:9000";
        break;
      default:
        siteUrl = "https://beta.unicorn-utterances.com";
    }
  }

  return {
    buildMode,
    siteUrl,
  };
};
