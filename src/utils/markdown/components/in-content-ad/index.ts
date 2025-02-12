import { createComponent } from "../utils";
import { transformInContentAd } from "./rehype-transform";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { InContentAdProps } from "utils/markdown/components/in-content-ad/ad";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const inContentAd = createComponent<InContentAdProps>()
	.withBuildTime({
		transform: transformInContentAd,
	})
	.withRuntime({
		componentFSPath: resolve(__dirname, "ad.tsx"),
	});
