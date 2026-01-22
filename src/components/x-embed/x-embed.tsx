import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Button, IconOnlyButton } from "components/button/button";
import discussion from "src/icons/discussion.svg?raw";
import repost from "src/icons/repost.svg?raw";
import heart from "src/icons/heart.svg?raw";
import launch from "src/icons/launch.svg?raw";
import style from "./x-embed.module.scss";
import { RawSvg } from "components/image/raw-svg";

dayjs.extend(advancedFormat);

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
	const dayjsDate = dayjs(date);
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
				<Button
					class={style.textButton}
					href={link}
					target="_blank"
					rel="nofollow noopener noreferrer"
				>
					View on X
				</Button>
				<IconOnlyButton
					class={style.iconButton}
					href={link}
					target="_blank"
					rel="nofollow noopener noreferrer"
					aria-label={"View on X"}
				>
					<RawSvg icon={launch} />
				</IconOnlyButton>
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
			<div className={style.footer}>
				<div className={style.footerStats}>
					<div className={`text-style-body-small-bold ${style.statContainer}`}>
						<span
							className={style.statIcon}
							dangerouslySetInnerHTML={{ __html: discussion }}
						/>
						<span>{replies ?? 0}</span>
					</div>
					<div className={`text-style-body-small-bold ${style.statContainer}`}>
						<span
							className={style.statIcon}
							dangerouslySetInnerHTML={{ __html: repost }}
						/>
						<span>{reposts ?? 0}</span>
					</div>
					<div className={`text-style-body-small-bold ${style.statContainer}`}>
						<span
							className={style.statIcon}
							dangerouslySetInnerHTML={{ __html: heart }}
						/>
						<span>{likes ?? 0}</span>
					</div>
				</div>
				<p className={style.timeContainer}>
					<span className={`text-style-body-small-bold`}>
						{dayjsDate.format("MMM Do, YYYY")}
					</span>
					<span className={`text-style-body-small ${style.timeSaparator}`}>
						•
					</span>
					<span className={`text-style-body-small ${style.time}`}>
						{dayjsDate.format("h:mm A")}
					</span>
				</p>
			</div>
		</div>
	);
}

function shortenNumber(number: number) {
	if (number > 1000000) {
		return `${(number / 1000000).toFixed(1)}M`;
	} else if (number > 1000) {
		return `${(number / 1000).toFixed(1)}K`;
	}
	return number.toString();
}
