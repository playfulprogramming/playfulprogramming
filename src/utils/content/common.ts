import { join } from "path";
import { Settings } from "typebox/system";

Settings.Set({ correctiveParse: true });

export const contentDirectory = join(process.cwd(), "content");
