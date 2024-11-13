import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Injectable,
	Component,
	ElementRef,
	inject,
	viewChild,
	viewChildren,
	signal,
	afterRenderEffect,
	output,
	input,
	OutputEmitterRef,
} from "@angular/core";

@Injectable()
class CloseIfOutSideContext {
	getCloseIfOutsideFunction = (
		contextMenu: ElementRef<HTMLElement>,
		close: OutputEmitterRef<void>,
	) => {
		return (e: MouseEvent) => {
			const contextMenuEl = contextMenu?.nativeElement;
			if (!contextMenuEl) return;
			const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
			if (isClickInside) return;
			close.emit();
		};
	};

	contextMenu!: () => ElementRef;
	close!: OutputEmitterRef<void>;

	constructor() {
		afterRenderEffect((onCleanup) => {
			this.closeIfOutsideOfContext = this.getCloseIfOutsideFunction(
				this.contextMenu(),
				this.close,
			);
			document.addEventListener("click", this.closeIfOutsideOfContext);
			onCleanup(() => {
				document.removeEventListener("click", this.closeIfOutsideOfContext);
				this.closeIfOutsideOfContext = () => {};
			});
		});
	}

	closeIfOutsideOfContext: (e: MouseEvent) => void = () => {};
}

@Component({
	selector: "context-menu",
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
	providers: [CloseIfOutSideContext],
})
class ContextMenuComponent {
	contextMenu = viewChild.required("contextMenu", {
		read: ElementRef<HTMLElement>,
	});

	x = input(0);
	y = input(0);
	close = output();

	constructor() {
		const closeIfOutside = inject(CloseIfOutSideContext);
		closeIfOutside.close = this.close;
		closeIfOutside.contextMenu = this.contextMenu;
	}

	focus() {
		this.contextMenu().nativeElement.focus();
	}
}

@Injectable()
class BoundsContext {
	bounds = signal({
		height: 0,
		width: 0,
		x: 0,
		y: 0,
	});

	contextOrigin!: () => ElementRef;

	resizeListener = () => {
		if (!this.contextOrigin) return;
		this.bounds.set(this.contextOrigin().nativeElement.getBoundingClientRect());
	};

	constructor() {
		afterRenderEffect((onCleanup) => {
			this.bounds.set(
				this.contextOrigin().nativeElement.getBoundingClientRect(),
			);

			window.addEventListener("resize", this.resizeListener);
			onCleanup(() => {
				window.removeEventListener("resize", this.resizeListener);
			});
		});
	}
}

@Component({
	selector: "app-root",
	imports: [ContextMenuComponent],
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
			></context-menu>
		}
	`,
	providers: [BoundsContext],
})
class AppComponent {
	contextOrigin = viewChild.required("contextOrigin", {
		read: ElementRef<HTMLElement>,
	});
	contextMenu = viewChildren("contextMenu", { read: ContextMenuComponent });

	isOpen = signal(false);

	boundsContext = inject(BoundsContext);

	constructor() {
		this.boundsContext.contextOrigin = this.contextOrigin;

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

bootstrapApplication(AppComponent);
