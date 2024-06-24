import { AstroIntegration } from "astro";
import * as fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

const copyFiles = async (srcDir: string, destDir: string) => {
	const readDir = await fs.promises.readdir(srcDir);

	await Promise.all(
		readDir.map(async (file) => {
			const srcFile = path.resolve(srcDir, file);
			const destFile = path.resolve(destDir, file);

			// If it's a directory, recurse
			const lstat = await fs.promises.lstat(srcFile);
			if (lstat.isDirectory()) {
				if (!fs.existsSync(destFile)) {
					await fs.promises.mkdir(destFile);
				}
				await copyFiles(srcFile, destFile);
			} else {
				await fs.promises.copyFile(
					srcFile,
					destFile,
					// Do not overwrite files, as the transforms may have already been applied
					fs.constants.COPYFILE_EXCL,
				);
			}
		}),
	);
};

export const astroIntegrationCopyGenerated = (): AstroIntegration => {
	return {
		name: "astro-integration-copy-generated",
		hooks: {
			"astro:build:done": async ({ dir }) => {
				const srcDir = path.resolve("public/generated");
				const destDir = path.resolve(fileURLToPath(dir), "generated");
				await copyFiles(srcDir, destDir);
			},
		},
	};
};
