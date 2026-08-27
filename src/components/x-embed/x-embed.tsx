import { Button, IconOnlyButton } from "#components/button/button.tsx";
import discussion from "#src/icons/discussion.svg?raw";
import repost from "#src/icons/repost.svg?raw";
import heart from "#src/icons/heart.svg?raw";
import launch from "#src/icons/launch.svg?raw";
import style from "./x-embed.module.scss";
import { RawSvg } from "#components/image/raw-svg.tsx";
import { formatDate, formatEnglishOrdinalDate, toDate } from "#utils/date.ts";

interface XEmbedPicture {
	src: string;
	altText?: string;
	width?: number;
	height?: number;
}

export interface XEmbedPlaceholderProps {
	text: string;
	profilePic: string;
	likes?: number;
	reposts?: number;
	replies?: number;
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
	const postDate = toDate(date);
	const isValidDate = !Number.isNaN(postDate.valueOf());
	const formattedDate = isValidDate
		? formatEnglishOrdinalDate(postDate, {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: date;
	const formattedTime = isValidDate
		? formatDate(postDate, {
				hour: "numeric",
				minute: "2-digit",
			})
		: undefined;
	return (
		<div className={style.container}>
			<div className={style.topContainer}>
				<div className={style.profilePic}>
					<img
						data-dont-round
						data-nozoom
						src={profilePic}
						alt={`${handle}'s profile picture`}
						crossorigin="anonymous"
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
						src={picture.src}
						alt={picture.altText ?? ""}
						width={picture.width}
						height={picture.height}
						style={{
							aspectRatio:
								picture.width && picture.height
									? `${picture.width}/${picture.height}`
									: undefined,
						}}
						crossorigin="anonymous"
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
					<span className={`text-style-body-small-bold`}>{formattedDate}</span>
					{formattedTime ? (
						<>
							<span className={`text-style-body-small ${style.timeSaparator}`}>
								•
							</span>
							<span className={`text-style-body-small ${style.time}`}>
								{formattedTime}
							</span>
						</>
					) : null}
				</p>
			</div>
		</div>
	);
}
