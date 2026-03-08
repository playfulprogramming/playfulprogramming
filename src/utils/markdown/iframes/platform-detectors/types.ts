import { UrlMetadataResponse } from "utils/hoof";

export interface RehypeEmbedTransformProps<
	T extends NonNullable<UrlMetadataResponse["embed"]>["type"],
> {
	src: string;
	metadata: UrlMetadataResponse;
	embed: UrlMetadataResponse["embed"] & { type: T };
}
