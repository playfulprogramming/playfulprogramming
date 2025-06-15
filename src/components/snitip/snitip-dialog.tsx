import { Dialog } from "components/dialog/dialog";
import { SnitipContent, SnitipProps } from "./snitip";
import { IconOnlyButton } from "components/button/button";
import iconClose from "src/icons/close.svg?raw";
import style from "./snitip.module.scss";

export function SnitipDialog({ snitip, ...extra }: SnitipProps) {
	return (
		<Dialog
			id={String(extra.id)}
			dialogClass={style.dialog}
			formClass={style.form}
			open={false}
		>
			<IconOnlyButton
				id="snitip-close"
				tag="button"
				aria-label={"Close"}
				class={style.closeButton}
				autofocus
			>
				<div dangerouslySetInnerHTML={{ __html: iconClose }}></div>
			</IconOnlyButton>

			<SnitipContent snitip={snitip} />
		</Dialog>
	);
}