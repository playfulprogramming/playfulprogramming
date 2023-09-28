import style from "./license.module.scss";
import { useEffect, useRef, useState } from "preact/hooks";
import { LargeIconOnlyButton } from "components/index";
import close from "src/icons/close.svg?raw";

interface LicenseProps {
	name: string;
	action: string;
	image: string;
	url: string;
}

export function License(props: LicenseProps) {
	const [isOpen, setOpen] = useState(false);

	const handleOpen = (e: Event) => {
		e.preventDefault();
		console.log("open!");
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div class={style.license}>
			<img width="24" height="24" src={props.image} loading="lazy" />
			<div class="text-style-button-regular">
				<span>{props.name}</span>
				<button class={style.viewButton} onClick={handleOpen}>{props.action}</button>
			</div>
			{
				isOpen ?
					<LicenseDialog
						name={props.name}
						onClose={handleClose}
					/>
					: <></>
			}
		</div>
	);
}

interface LicenseDialogProps {
	name: string;
	onClose: () => void;
}

export function LicenseDialog({
	name,
	onClose,
}: LicenseDialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		console.log("showModal called", dialogRef.current);
		dialogRef.current?.showModal();
	}, [dialogRef.current]);

	return (
		<dialog onClose={onClose} class={style.licenseDialog} ref={dialogRef}>
			<div class={style.titleContainer}>
				<LargeIconOnlyButton
					tag="button"
					type="button"
					onClick={onClose}
					class={style.closeButton}
					aria-label="Close"
				>
					<span dangerouslySetInnerHTML={{ __html: close }} />
				</LargeIconOnlyButton>
				<h1 class={`text-style-headline-4 ${style.title}`}>{name}</h1>
			</div>
			<p>
				The Android robot is reproduced or modified from work created and shared by Google and used according to terms described in
				the <a href="https://example.com">Creative Commons</a> 3.0 Attribution License.
			</p>
		</dialog>
	);
}
