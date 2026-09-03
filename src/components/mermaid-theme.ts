const GIT_THEME_TOKENS = [
	["--primary_medium", "--primary_on-medium"],
	["--primary_low", "--primary_on-low"],
	["--secondary_medium", "--secondary_on-medium"],
	["--secondary_low", "--secondary_on-low"],
	["--error_medium", "--error_on-medium"],
	["--error_low", "--error_on-low"],
	["--positive_medium", "--positive_on-medium"],
	["--positive_low", "--positive_on-low"],
] as const;

const GIT_THEME_CSS = GIT_THEME_TOKENS.map(([color, onColor], index) => {
	const indexes = [index, index + 8].filter((value) => value < 12);
	const select = (...prefixes: string[]) =>
		`:is(${indexes
			.flatMap((value) => prefixes.map((prefix) => `.${prefix}${value}`))
			.join(",")})`;
	const branchLabelSelector = select("branch-label");

	return `
			${select("branch", "arrow")} {
				stroke: var(${color});
			}
			${select("commit", "label")} {
				fill: var(${color});
				stroke: var(${color});
			}
			${select("commit-highlight")} {
				fill: var(${color});
				stroke: var(${color});
			}
			${branchLabelSelector},
			${branchLabelSelector} text,
			${branchLabelSelector} tspan {
				fill: var(${onColor});
				color: var(${onColor});
			}
		`;
}).join("\n");

export const MERMAID_THEME_CSS = `
	text,
	tspan {
		fill: var(--mermaid-text-color);
	}
	.label,
	.nodeLabel,
	.cluster-label {
		color: var(--mermaid-text-color);
	}

	.node rect,
	.node circle,
	.node ellipse,
	.node polygon,
	.node path {
		fill: var(--mermaid-primary-color);
		stroke: var(--mermaid-border-color);
	}
	.flowchart-link,
	.edgePath .path,
	.transition,
	.relationshipLine {
		fill: none;
		stroke: var(--mermaid-line-color);
	}
	.marker.flowchart-v2 .arrowMarkerPath {
		fill: var(--mermaid-line-color);
		stroke: var(--mermaid-line-color);
	}
	.edgeLabel {
		color: var(--mermaid-text-color);
		background-color: var(--mermaid-label-background);
	}
	.edgeLabel rect,
	.edgeLabel .label rect {
		fill: var(--mermaid-label-background);
		background-color: var(--mermaid-label-background);
		opacity: 1;
	}
	.labelBkg {
		background-color: var(--mermaid-label-background);
	}
	.cluster rect,
	.statediagram-cluster rect {
		fill: var(--mermaid-label-background);
		stroke: var(--mermaid-border-color);
	}
	.cluster text,
	.cluster-label text {
		fill: var(--mermaid-text-color);
	}

	/* Sequence diagrams */
	.actor,
	.actorPopupMenuPanel {
		fill: var(--mermaid-primary-color);
		stroke: var(--mermaid-border-color);
	}
	text.actor > tspan,
	.messageText,
	.labelText,
	.labelText > tspan,
	.loopText,
	.loopText > tspan,
	.sectionTitle,
	.sectionTitle > tspan,
	.noteText,
	.noteText > tspan {
		fill: var(--mermaid-text-color);
		stroke: none;
	}
	.actor-line,
	.messageLine0,
	.messageLine1 {
		stroke: var(--mermaid-line-color);
	}
	[id$="-arrowhead"] path,
	[id$="-crosshead"] path,
	[id$="-sequencenumber"] {
		fill: var(--mermaid-line-color);
		stroke: var(--mermaid-line-color);
	}
	.labelBox {
		fill: var(--mermaid-primary-color);
		stroke: var(--mermaid-border-color);
	}
	.loopLine {
		fill: var(--mermaid-border-color);
		stroke: var(--mermaid-border-color);
	}
	.note,
	.state-note,
	.statediagram-note rect {
		fill: var(--mermaid-label-background);
		stroke: var(--mermaid-note-border-color);
	}
	.activation0,
	.activation1,
	.activation2 {
		fill: var(--mermaid-activation-color);
		stroke: var(--mermaid-activation-border-color);
	}
	.actor-man circle,
	.actor-man line {
		fill: var(--mermaid-primary-color);
		stroke: var(--mermaid-border-color);
	}
	g rect.rect {
		stroke: var(--mermaid-border-color);
	}

	/* Pie charts */
	.pieCircle {
		stroke: var(--mermaid-border-color);
		stroke-width: 1.6px;
		opacity: 0.85;
	}
	.pieCircle:nth-of-type(3n + 1) {
		fill: var(--mermaid-primary-color);
	}
	.pieCircle:nth-of-type(3n + 2) {
		fill: var(--mermaid-secondary-color);
	}
	.pieCircle:nth-of-type(3n) {
		fill: var(--mermaid-tertiary-color);
	}
	.pieOuterCircle {
		fill: none;
		stroke: var(--mermaid-border-color);
		stroke-width: 1.6px;
	}
	.pieTitleText,
	.slice {
		fill: var(--mermaid-text-color);
	}
	.legend text {
		fill: var(--mermaid-muted-text-color);
	}
	/* Mermaid writes legend colors inline. */
	.legend:nth-of-type(3n + 2) rect {
		fill: var(--mermaid-primary-color) !important;
		stroke: var(--mermaid-primary-color) !important;
	}
	.legend:nth-of-type(3n) rect {
		fill: var(--mermaid-secondary-color) !important;
		stroke: var(--mermaid-secondary-color) !important;
	}
	.legend:nth-of-type(3n + 1) rect {
		fill: var(--mermaid-tertiary-color) !important;
		stroke: var(--mermaid-tertiary-color) !important;
	}

	/* Git graphs */
	${GIT_THEME_CSS}
	.commit.commit-highlight-inner {
		fill: var(--background_primary);
		stroke: var(--background_primary);
	}
	.commit.commit-merge {
		fill: var(--mermaid-primary-color);
		stroke: var(--mermaid-primary-color);
	}
	.commit.commit-reverse {
		fill: none;
		stroke: var(--mermaid-primary-color);
		stroke-width: 3px;
	}
	.commit-label,
	.tag-label,
	.gitTitleText {
		fill: var(--mermaid-text-color);
	}
	.commit-label-bkg,
	.tag-label-bkg {
		fill: var(--mermaid-label-background);
		stroke: var(--mermaid-border-color);
		opacity: 1;
	}

	/* Entity relationship diagrams */
	.entityBox {
		fill: var(--mermaid-primary-color);
		stroke: var(--mermaid-border-color);
	}
	.relationshipLabelBox {
		fill: var(--mermaid-label-background);
		background-color: var(--mermaid-label-background);
		opacity: 1;
	}
	.node :is(.outer-path, .divider, .row-rect-odd) > path:nth-child(odd) {
		fill: var(--mermaid-primary-color);
		stroke: none;
	}
	.node .row-rect-even > path:nth-child(odd) {
		fill: var(--mermaid-secondary-color);
		stroke: none;
	}
	.node
		:is(.outer-path, .divider, .row-rect-odd, .row-rect-even)
		> path:nth-child(even) {
		fill: none;
		stroke: var(--mermaid-border-color);
	}
	.marker.er path {
		fill: none !important;
		stroke: var(--mermaid-line-color) !important;
	}
	.marker.er circle {
		fill: var(--background_primary) !important;
		stroke: var(--mermaid-line-color) !important;
	}

	/* State diagrams */
	g.stateGroup rect,
	.node rect,
	.node polygon {
		fill: var(--mermaid-primary-color);
		stroke: var(--mermaid-border-color);
	}
	g.stateGroup line,
	.transition {
		stroke: var(--mermaid-line-color);
	}
	.node circle.state-start,
	.node .fork-join,
	[id$="-barbEnd"],
	[id$="-dependencyStart"],
	[id$="-dependencyEnd"] {
		fill: var(--mermaid-line-color);
		stroke: var(--mermaid-line-color);
	}
	.node circle.state-end {
		fill: var(--mermaid-line-color);
		stroke: var(--background_primary);
	}
	.end-state-inner,
	.statediagram-cluster .inner {
		fill: var(--background_primary);
	}
	.statediagram-state .divider {
		stroke: var(--mermaid-border-color);
	}
`;
