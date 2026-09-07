import { isNotJunk as baseIsNotJunk } from "junk";

export function isNotJunk(name: string): boolean {
	// Ignore VSCode and JetBrains project files
	return baseIsNotJunk(name) && name !== ".idea" && name !== ".vscode";
}
