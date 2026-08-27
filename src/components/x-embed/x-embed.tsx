import type { Locale } from "#src/paraglide/runtime.js";
import { Button, IconOnlyButton } from "#components/button/button.tsx";
import discussion from "#src/icons/discussion.svg?raw";
import repost from "#src/icons/repost.svg?raw";
import heart from "#src/icons/heart.svg?raw";
import launch from "#src/icons/launch.svg?raw";
import style from "./x-embed.module.scss";
import { RawSvg } from "#components/image/raw-svg.tsx";

import { m } from "#src/paraglide/messages.js";

const ordinalMessages = {
	zero: m.date_ordinal_zero,
	one: m.date_ordinal_one,
	two: m.date_ordinal_two,
	few: m.date_ordinal_few,
	many: m.date_ordinal_many,
	other: m.date_ordinal_other,
} as const;

export function formatPostDate(date: Date, locale: Locale) {
	const formatter = new Intl.DateTimeFormat(locale, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
	const ordinalRule = new Intl.PluralRules(locale, { type: "ordinal" }).select(
		date.getDate(),
	);

	return formatter
		.formatToParts(date)
		.map((part) =>
			part.type === "day"
				? ordinalMessages[ordinalRule]({ day: part.value }, { locale })
				: part.value,
		)
		.join("");
}

interface XEmbedPicture {
	src: string;
	altText?: string;
	width?: number;
	height?: number;
}

export interface XEmbedPlaceholderProps {
	locale: Locale;
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
	const postDate = new Date(date);
	const isValidDate = !Number.isNaN(postDate.valueOf());
	const formattedDate = isValidDate ? formatPostDate(postDate, locale) : date;
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
						alt={m.label_profile_picture_for({ handle }, { locale })}
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
					{m.action_view_on_x({}, { locale })}
				</Button>
				<IconOnlyButton
					class={style.iconButton}
					href={link}
					target="_blank"
					rel="nofollow noopener noreferrer"
					aria-label={m.action_view_on_x({}, { locale })}
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
