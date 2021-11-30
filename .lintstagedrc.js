module.exports = {
  '**/*.{js,ts,tsx,jsx}': (filenames) =>
    `next lint --fix --file ${filenames
      .map((file) => file.split(process.cwd())[1])
      .join(' --file ')}`,
}
