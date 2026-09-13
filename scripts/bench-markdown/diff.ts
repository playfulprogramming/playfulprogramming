// Generated with Claude Code

export function firstDifference(a: string, b: string): string {
	let i = 0;
	while (i < a.length && a[i] === b[i]) i++;
	const from = Math.max(0, i - 80);
	return `at byte ${i}:\n- ${a.slice(from, i + 80)}\n+ ${b.slice(from, i + 80)}`;
}

export function report(changed: string[], total: number, what: string) {
	console.log(`${total} ${what}, ${changed.length} differ`);
	if (changed.length) process.exitCode = 1;
}
