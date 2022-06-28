const path = require("path");

module.exports = {
  "**/*.{js,ts,tsx,jsx}": (filenames) =>
    `next lint --fix --file ${filenames
      .map((file) => {
        return path.relative(process.cwd(), file);
      })
      .join(" --file ")}`,
  "**/*.md": (filenames) => `remark ${filenames.join(" ")} -o --`,
};
