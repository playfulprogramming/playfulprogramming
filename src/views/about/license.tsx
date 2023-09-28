import style from "./license.module.scss";
import { useEffect, useRef, useState } from "preact/hooks";
import { LargeIconOnlyButton } from "components/index";
import close from "src/icons/close.svg?raw";
import { createPortal } from "preact/compat";

interface LicenseProps {
	name: string;
	explainerHtml: string;
	action: string;
	image: string;
}

export function License(props: LicenseProps) {
	const [isOpen, setOpen] = useState(false);

	const handleOpen = (e: Event) => {
		e.stopPropagation();
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div class={style.license} onClick={handleOpen}>
			<img class={style.icon} width="24" height="24" src={props.image} loading="lazy" />
			<div class={`text-style-button-regular ${style.info}`}>
				<span>{props.name}</span>
				<button class={style.viewButton} onClick={handleOpen}>{props.action}</button>
			</div>
			{
				isOpen ?
					createPortal(
						<LicenseDialog
							image={props.image}
							name={props.name}
							explainerHtml={props.explainerHtml}
							onClose={handleClose}
						/>,
						document.body,
					)
					: <></>
			}
		</div>
	);
}

interface LicenseDialogProps {
	image: string;
	name: string;
	explainerHtml: string;
	onClose: () => void;
}

export function LicenseDialog({
	image,
	name,
	explainerHtml,
	onClose,
}: LicenseDialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		dialogRef.current?.showModal();
	}, [dialogRef.current]);

	const handleClick = (e: Event) => {
		if (e.target === dialogRef.current)
			onClose();
	};

	return (
		<dialog onClose={onClose} onClick={handleClick} class={style.licenseDialog} ref={dialogRef}>
			<form method="dialog" class={style.form}>
				<div class={style.titleContainer}>
					<LargeIconOnlyButton
						tag="button"
						class={style.closeButton}
						aria-label="Close"
					>
						<span style="display: flex;" dangerouslySetInnerHTML={{ __html: close }} />
					</LargeIconOnlyButton>
					<h1 class={`text-style-headline-4 ${style.title}`}>{name}</h1>
				</div>
				<div class={`text-style-body-large ${style.body}`}>
					<img class={style.iconLarge} width="128" height="128" src={image} loading="lazy" />
					<div
						class="post-body"
						dangerouslySetInnerHTML={{ __html: explainerHtml }}
					/>
				</div>
			</form>
		</dialog>
	);
}
