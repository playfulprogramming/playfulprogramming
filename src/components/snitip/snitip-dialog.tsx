import { IconOnlyButton } from "#components/button/button.tsx";
import { Dialog } from "#components/dialog/dialog.tsx";
import { RawSvg } from "#components/image/raw-svg.tsx";
import iconClose from "#src/icons/close.svg?raw";
import { SnitipContent, type SnitipProps } from "./snitip.tsx";
import style from "./snitip.module.scss";

const ignoreDialogClose = () => {};

type SnitipDialogProps = Omit<SnitipProps, "id"> & { id?: string };

export function SnitipDialog({
	snitip,
	id,
	headingTag,
	includeSearchTags,
}: SnitipDialogProps) {
	return (
		<Dialog
			id={id}
			aria-label={`Tooltip: ${snitip.title}`}
			dialogClass={style.dialog}
			formClass={style.form}
			open={false}
			onClose={ignoreDialogClose}
		>
			<IconOnlyButton
				data-snitip-close
				tag="button"
				aria-label="Close"
				class={style.closeButton}
				autofocus
			>
				<RawSvg aria-hidden icon={iconClose} />
			</IconOnlyButton>

			<SnitipContent
				snitip={snitip}
				headingTag={headingTag}
				includeSearchTags={includeSearchTags}
			/>
		</Dialog>
	);
}
