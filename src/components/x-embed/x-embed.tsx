import style from "./x-embed.module.scss";

export interface XEmbedPlaceholderProps {
	text: string;
	profilePic: string;
	likes: number;
	reposts: number;
	replies: number;
}

export function XEmbedPlaceholder({
	text,
	profilePic,
	likes,
	reposts,
	replies,
}: XEmbedPlaceholderProps) {
	return <div>{text}</div>;
}
