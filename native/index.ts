import { createRequire } from "node:module";
import nodeUrl from "./index.node?url";

interface NativeDefault {
	renderMermaid(document: string): string;
}

const requireNative = createRequire(import.meta.url);
let native: NativeDefault | undefined;
try {
	native = requireNative(`..${nodeUrl}`);
} catch (e) {
	console.error("Error loading @playfulprogramming/native", e);
}

export default native;
