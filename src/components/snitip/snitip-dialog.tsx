import { IconOnlyButton } from "#components/button/button.tsx";
import { RawSvg } from "#components/image/raw-svg.tsx";
import iconClose from "#src/icons/close.svg?raw";
import { SnitipContent, type SnitipProps } from "./snitip.tsx";
import style from "./snitip.module.scss";

type SnitipDialogProps = Omit<SnitipProps, "id"> & {
	id: string;
};

export function SnitipDialog({
	snitip,
	id,
	headingTag,
	includeSearchTags,
}: SnitipDialogProps) {
	const headingId = `${id}-title`;

	return (
		<dialog
			id={id}
			aria-labelledby={headingId}
			aria-modal="true"
			class={`${style.dialog} post-body`}
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore This newer native attribute is not in every TS DOM release.
			closedby="closerequest"
		>
			<svg
				data-snitip-arrow
				aria-hidden
				width="24"
				height="14"
				viewBox="0 0 24 14"
				fill="none"
				class={style.arrow}
				data-placement="bottom"
			>
				<path
					d="M 2 -1 L 11.2 11.6 C 11.6 12.1333 12.4 12.1333 12.8 11.6 L 22 -1 Z"
					fill="var(--snitip_background-color)"
				/>
				<path
					d="M 2 -1 L 11.2 11.6 C 11.6 12.1333 12.4 12.1333 12.8 11.6 L 22 -1"
					stroke="var(--snitip_border-color)"
					strokeWidth="var(--snitip_border-width)"
				/>
			</svg>
			<form method="dialog" class={style.form}>
				<SnitipContent
					snitip={snitip}
					headingTag={headingTag}
					headingId={headingId}
					headingLabelPrefix="Tooltip: "
					headingTabIndex={-1}
					includeSearchTags={includeSearchTags}
				/>

				<IconOnlyButton
					data-snitip-close
					tag="button"
					type="submit"
					formNoValidate
					value="close"
					aria-label="Close tooltip"
					class={style.closeButton}
				>
					<RawSvg aria-hidden icon={iconClose} />
				</IconOnlyButton>
			</form>
		</dialog>
	);
}
