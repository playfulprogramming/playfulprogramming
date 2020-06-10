/**
 * This is both a JS file and using CJS because it's used in `gatsby-config`
 */
exports.SeriesToC = context => {
	const { items, name, markdownNode } = context;
	const list = items.reduce((code, item, i) => {
		const isActive = item.slug.endsWith(markdownNode.fields.slug);
		const liClass = isActive ? "isActive" : "";

		const titleName = item.title.replace(new RegExp(`^${name}: `), "");

		const inner = `<a href="${item.slug}">Part ${i + 1}: ${titleName}</a>`;

		return `${code}<li class="${liClass}" role="listitem">${inner}</li>`.trim();
	}, "");

	const body = `<ol aria-labelledby="series-header" role="list">${list}</ol>`;
	const title = `<div id="series-header">Part of our series: ${name}</div>`;

	return `
<div class="series-table-of-content">
  ${title}
  ${body}
</div>
  `.trim();
};
