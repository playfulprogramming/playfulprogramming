import { join } from "path";
import { Settings } from "typebox/system";
import { MarkdownVFile } from "../markdown/types";

Settings.Set({ correctiveParse: true });

export const contentDirectory = join(process.cwd(), "content");

export function cache<Arg1 extends { file: string }, Ret>(
	callback: (arg1: Arg1, arg2?: Promise<MarkdownVFile>) => Promise<Ret>,
) {
	const map = new Map<string, Ret>();
	return async (arg1: Arg1, arg2?: Promise<MarkdownVFile>) => {
		const key = arg1.file;
		const ret = map.get(key);
		if (ret) return ret;

		const result = await callback(arg1, arg2);
		map.set(key, result);
		return result;
	};
}
