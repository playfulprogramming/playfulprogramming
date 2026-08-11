import type { UrlMetadataResponse } from "#utils/hoof/index.ts";

export interface RehypeEmbedTransformProps<
	T extends NonNullable<UrlMetadataResponse["embed"]>["type"],
> {
	src: string;
	metadata: UrlMetadataResponse;
	embed: UrlMetadataResponse["embed"] & { type: T };
}
