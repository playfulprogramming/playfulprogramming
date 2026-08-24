import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Button, IconOnlyButton } from "#components/button/button.tsx";
import discussion from "#src/icons/discussion.svg?raw";
import repost from "#src/icons/repost.svg?raw";
import heart from "#src/icons/heart.svg?raw";
import launch from "#src/icons/launch.svg?raw";
import style from "./x-embed.module.scss";
import { RawSvg } from "#components/image/raw-svg.tsx";
import type { Languages } from "#types/index.ts";
import { createTranslator } from "#utils/translations.ts";

dayjs.extend(advancedFormat);

interface XEmbedPicture {
	src: string;
	altText?: string;
	width?: number;
	height?: number;
}

export interface XEmbedPlaceholderProps {
	locale: Languages;
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
	locale,
}: XEmbedPlaceholderProps) {
	const translate = createTranslator(locale);
	const postDate = new Date(date);
	const isValidDate = !Number.isNaN(postDate.valueOf());
	const formattedDate = isValidDate
		? locale === "en"
			? dayjs(postDate).format("MMM Do, YYYY")
			: new Intl.DateTimeFormat(locale, {
					month: "short",
					day: "numeric",
					year: "numeric",
				}).format(postDate)
		: date;
	const formattedTime = isValidDate
		? new Intl.DateTimeFormat(locale, {
				hour: "numeric",
				minute: "2-digit",
			}).format(postDate)
		: undefined;
	return (
		<div className={style.container}>
			<div className={style.topContainer}>
				<div className={style.profilePic}>
					<img
						data-dont-round
						data-nozoom
						src={profilePic}
						alt={translate("label.profile_picture_for", handle)}
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
					{translate("action.view_on_x")}
				</Button>
				<IconOnlyButton
					class={style.iconButton}
					href={link}
					target="_blank"
					rel="nofollow noopener noreferrer"
					aria-label={translate("action.view_on_x")}
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
						<span>{(replies ?? 0).toLocaleString(locale)}</span>
					</div>
					<div className={`text-style-body-small-bold ${style.statContainer}`}>
						<span
							className={style.statIcon}
							dangerouslySetInnerHTML={{ __html: repost }}
						/>
						<span>{(reposts ?? 0).toLocaleString(locale)}</span>
					</div>
					<div className={`text-style-body-small-bold ${style.statContainer}`}>
						<span
							className={style.statIcon}
							dangerouslySetInnerHTML={{ __html: heart }}
						/>
						<span>{(likes ?? 0).toLocaleString(locale)}</span>
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
