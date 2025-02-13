import { COMPONENT_FOLDER, createComponent } from "../utils";
import { transformInContentAd } from "./rehype-transform";
import { resolve } from "node:path";
import { InContentAdProps } from "utils/markdown/components/in-content-ad/ad";

export const inContentAd = createComponent<InContentAdProps>()
	.withBuildTime({
		transform: transformInContentAd,
	})
	.withRuntime({
		componentFSPath: resolve(COMPONENT_FOLDER, "./in-content-ad/ad.tsx"),
	});
