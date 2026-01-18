import dayjs from "dayjs";
import style from "./x-embed.module.scss";
import { Button } from "components/button/button";

interface XEmbedPicture {
	url: string;
	alt?: string;
	aspectRatio?: number;
}

export interface XEmbedPlaceholderProps {
	text: string;
	profilePic: string;
	likes: number;
	reposts: number;
	replies: number;
	date: string;
	handle: string;
	name: string;
	link: string;
	picture?: XEmbedPicture;
}

export function XEmbedPlaceholder({
	text,
	profilePic,
	likes,
	reposts,
	replies,
	date,
	handle,
	name,
	link,
	picture,
}: XEmbedPlaceholderProps) {
	return (
		<div className={style.container}>
			<div className={style.topContainer}>
				<div className={style.profilePic}>
					<img
						data-dont-round
						data-nozoom
						src={profilePic}
						alt={`${handle}'s profile picture`}
					/>
				</div>
				<div className={style.topWide}>
					<p className={`text-style-body-medium-bold ${style.name}`}>{name}</p>
					<p className={`text-style-body-medium-bold ${style.handle}`}>
						@{handle}
					</p>
				</div>
				<Button href={link}>View on X</Button>
			</div>
			<p className={`text-style-body-large ${style.textContainer}`}>{text}</p>
			{picture ? (
				<div className={style.mediaContainer}>
					<img
						src={picture.url}
						alt={picture.alt}
						style={{ aspectRatio: picture.aspectRatio }}
					/>
				</div>
			) : null}
		</div>
	);
}
