import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ElementRef,
	viewChild,
	viewChildren,
	signal,
	Signal,
	afterRenderEffect,
	output,
	input,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

const useOutsideClick = (
	contextMenu: Signal<ElementRef>,
	onClose: () => void,
) => {
	afterRenderEffect((onCleanup) => {
		const closeIfOutsideOfContext = (e: MouseEvent) => {
			const contextMenuEl = contextMenu()?.nativeElement;
			if (!contextMenuEl) return;
			const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
			if (isClickInside) return;
			onClose();
		};

		document.addEventListener("click", closeIfOutsideOfContext);
		onCleanup(() => {
			document.removeEventListener("click", closeIfOutsideOfContext);
		});
	});
};

@Component({
	selector: "context-menu",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			#contextMenu
			tabIndex="0"
			[style]="{
				position: 'fixed',
				top: y() + 20,
				left: x() + 20,
				background: 'white',
				border: '1px solid black',
				borderRadius: 16,
				padding: '1rem',
			}"
		>
			<button (click)="close.emit()">X</button>
			This is a context menu
		</div>
	`,
})
class ContextMenuComponent {
	contextMenu = viewChild.required("contextMenu", {
		read: ElementRef<HTMLElement>,
	});

	x = input(0);
	y = input(0);
	close = output();

	constructor() {
		useOutsideClick(this.contextMenu, () => this.close.emit());
	}

	focus() {
		this.contextMenu().nativeElement.focus();
	}
}

const useBounds = (contextOrigin: Signal<ElementRef>) => {
	const bounds = signal({
		height: 0,
		width: 0,
		x: 0,
		y: 0,
	});

	const resizeListener = () => {
		if (!contextOrigin()) return;
		bounds.set(contextOrigin().nativeElement.getBoundingClientRect());
	};

	afterRenderEffect((onCleanup) => {
		bounds.set(contextOrigin().nativeElement.getBoundingClientRect());

		window.addEventListener("resize", resizeListener);
		onCleanup(() => {
			window.removeEventListener("resize", resizeListener);
		});
	});

	return { bounds };
};

@Component({
	selector: "app-root",
	imports: [ContextMenuComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div [style]="{ marginTop: '5rem', marginLeft: '5rem' }">
			<div #contextOrigin (contextmenu)="open($event)">Right click on me!</div>
		</div>
		@if (isOpen()) {
			<context-menu
				#contextMenu
				[x]="boundsContext.bounds().x"
				[y]="boundsContext.bounds().y"
				(close)="close()"
			/>
		}
	`,
})
class AppComponent {
	contextOrigin = viewChild.required("contextOrigin", {
		read: ElementRef<HTMLElement>,
	});
	contextMenu = viewChildren("contextMenu", { read: ContextMenuComponent });

	isOpen = signal(false);

	boundsContext = useBounds(this.contextOrigin);

	constructor() {
		afterRenderEffect(() => {
			this.contextMenu().forEach(() => {
				const isLoaded = this?.contextMenu()[0];
				if (!isLoaded) return;
				this.contextMenu()[0].focus();
			});
		});
	}

	close() {
		this.isOpen.set(false);
	}

	open(e: UIEvent) {
		e.preventDefault();
		this.isOpen.set(true);
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
