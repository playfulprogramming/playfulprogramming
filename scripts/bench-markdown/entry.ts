// Generated with Claude Code

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { unified, type Processor, type Transformer } from "unified";
import { Type } from "typebox";
import Value from "typebox/value";
import { createHtmlPlugins } from "#utils/markdown/createHtmlPlugins.ts";
import { getMarkdownVFile } from "#utils/markdown/getMarkdownVFile.ts";
import type { PostInfo } from "#types/index.ts";
import * as api from "#utils/api.ts";
import { baseLocale } from "#src/paraglide/runtime.js";
import { firstDifference, report } from "./diff.ts";

const Args = Type.Object({
	targets: Type.Array(Type.String()),
	iterations: Type.String(),
	full: Type.Boolean(),
	mode: Type.Union([
		Type.Literal("none"),
		Type.Literal("write"),
		Type.Literal("compare"),
	]),
	final: Type.Boolean(),
	snapshot: Type.String(),
});
const Rounds = Type.Array(Type.Record(Type.String(), Type.Number()));

const args = Value.Parse(Args, JSON.parse(process.env.BENCH_ARGS ?? "{}"));
const iterations = Number(args.iterations);
const warmup = 1;
if (args.mode === "write") await fs.mkdir(args.snapshot, { recursive: true });

const uuidRe =
	/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi;

const changed: string[] = [];
let checked = 0;

async function snapshot(name: string, output: string) {
	const file = path.join(args.snapshot, `${name}.json`);
	if (args.mode === "none") return;
	if (args.mode === "write") return fs.writeFile(file, output);
	checked++;
	const before = await fs.readFile(file, "utf-8").catch(() => "");
	if (before === output) return;
	changed.push(name);
	if (args.full) console.log(`${name} ${firstDifference(before, output)}\n`);
}

let passMs = new Map<string, number[]>();

function timed<T>(name: string, fn: () => T): T {
	const t0 = performance.now();
	const result = fn();
	const done = () => {
		const list = passMs.get(name) ?? [];
		list.push(performance.now() - t0);
		passMs.set(name, list);
	};
	if (result instanceof Promise) result.then(done, () => undefined);
	else done();
	return result;
}

function timePasses(processor: Processor) {
	for (const attacher of processor.attachers) {
		const original = attacher[0];
		const name = original.name || "(anonymous plugin)";
		attacher[0] = function (...options) {
			const transformer = original.apply(this, options);
			if (typeof transformer !== "function") return transformer;
			if (transformer.length > 2) {
				throw new Error(`${name} uses the callback transformer style`);
			}
			const timedTransformer: Transformer = (tree, file) =>
				timed(name, () => transformer(tree, file, () => undefined));
			return timedTransformer;
		};
	}
}

async function runOnce(processor: Processor, info: PostInfo) {
	const vfile = await getMarkdownVFile(info);
	const mdast = timed("parse", () => processor.parse(vfile));
	const hast = await processor.run(mdast, vfile);
	const output = timed("stringify", () => processor.stringify(hast, vfile));
	return JSON.stringify(output)
		.replaceAll(process.cwd(), "<root>")
		.replace(uuidRe, "<uuid>");
}

function median(values: number[]): number {
	const s = values.toSorted((a, b) => a - b);
	const mid = Math.floor(s.length / 2);
	return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const col = (n: number) => n.toFixed(2).padStart(10);

async function rounds(mode: string, passes?: Map<string, number>) {
	const file = path.join(args.snapshot, `passes.${mode}.json`);
	const all = Value.Parse(
		Rounds,
		JSON.parse(await fs.readFile(file, "utf-8").catch(() => "[]")),
	);
	if (passes) {
		all.push(Object.fromEntries(passes));
		await fs.writeFile(file, JSON.stringify(all));
	}
	return new Map(
		[...new Set(all.flatMap(Object.keys))].map((name) => [
			name,
			median(all.map((round) => round[name] ?? 0)),
		]),
	);
}

async function printPasses(passes: Map<string, number>) {
	if (args.mode !== "none") passes = await rounds(args.mode, passes);
	if (!args.final) return;
	const before = args.mode === "compare" ? await rounds("write") : undefined;
	const header = before ? " before ms   after ms      %" : "   wall ms";
	console.log(`${"pass".padEnd(34)} ${header}`);
	for (const [name, ms] of [...passes].toSorted((a, b) => b[1] - a[1])) {
		const was = before?.get(name);
		const delta =
			was === undefined || Math.abs(ms - was) < 0.5
				? ""
				: `${(((ms - was) / was) * 100).toFixed(0)}%`;
		const cells =
			was === undefined
				? col(ms)
				: `${col(was)} ${col(ms)} ${delta.padStart(6)}`;
		console.log(`${name.padEnd(34)} ${cells}`);
	}
}

async function benchFile(processor: Processor, info: PostInfo) {
	passMs = new Map();
	const totals: number[] = [];
	const outputs: string[] = [];

	for (let i = 0; i < warmup + iterations; i++) {
		const t0 = performance.now();
		outputs.push(await runOnce(processor, info));
		const total = performance.now() - t0;
		if (i >= warmup) totals.push(total);
		if (i === 0) console.log(`cold ${total.toFixed(2)} ms (one-time init)`);
	}

	const differing = outputs.findIndex((o) => o !== outputs[0]);
	if (differing !== -1) {
		console.error(
			`FAIL: iteration ${differing} differs from iteration 0 ${firstDifference(outputs[0], outputs[differing])}`,
		);
		process.exitCode = 1;
	}
	console.log(
		`warm (${iterations} runs) min=${Math.min(...totals).toFixed(2)} median=${median(totals).toFixed(2)} max=${Math.max(...totals).toFixed(2)} ms\n`,
	);
	await printPasses(
		new Map(
			[...passMs].map(([name, list]) => [
				name,
				median(list.slice(-iterations)),
			]),
		),
	);
	await snapshot(`${info.slug}.${info.locale}`, outputs[0]);
}

async function benchAll(processor: Processor) {
	const posts = (await api.getAllPosts()).toSorted((a, b) =>
		a.file < b.file ? -1 : 1,
	);
	await runOnce(processor, posts[0]);

	const perPost: Array<[string, number]> = [];
	const perPass = new Map<string, number>();
	const failed: string[] = [];
	const t0 = performance.now();
	for (const post of posts) {
		const name = `${post.slug}.${post.locale}`;
		passMs = new Map();
		const from = performance.now();
		const output = await runOnce(processor, post).catch((e: unknown) => {
			failed.push(name);
			return String(e);
		});
		perPost.push([name, performance.now() - from]);
		for (const [pass, list] of passMs) {
			perPass.set(
				pass,
				(perPass.get(pass) ?? 0) + list.reduce((a, b) => a + b),
			);
		}
		await snapshot(name, output);
	}
	const totalMs = performance.now() - t0;

	console.log(
		`${posts.length} posts in ${(totalMs / 1000).toFixed(1)} s, median ${median(perPost.map((p) => p[1])).toFixed(1)} ms/post`,
	);
	if (failed.length) {
		console.log(`${failed.length} threw: ${failed.join(" ")}`);
		process.exitCode = 1;
	}
	if (args.final) {
		console.log("\nslowest posts");
		for (const [name, ms] of perPost
			.toSorted((a, b) => b[1] - a[1])
			.slice(0, 15)) {
			console.log(`${col(ms)}  ${name}`);
		}
		console.log("\ntime per pass, summed over all posts");
	}
	await printPasses(perPass);
}

const processor: Processor = unified();
createHtmlPlugins(processor);
timePasses(processor);
if (args.targets.length === 0) {
	await benchAll(processor);
} else {
	for (const slug of args.targets) {
		const post = await api.getPostBySlug(slug, baseLocale);
		if (!post) throw new Error(`No post found for slug "${slug}"`);
		console.log(`\n${slug}`);
		await benchFile(processor, post);
	}
}
if (args.mode === "compare") {
	console.log();
	report(changed, checked, "posts");
	if (changed.length && !args.full)
		console.log("rerun with --full to see them");
}
