import { bootstrapApplication } from "@angular/platform-browser";

import {
	afterRenderEffect,
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	input,
	Input,
	OnDestroy,
	output,
	Output,
	signal,
	viewChild,
	ViewChild,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "context-menu",
	template: `
		@if (isOpen()) {
			<div
				tabIndex="0"
				#contextMenu
				[style]="
					'
        position: fixed;
        top: ' +
					y() +
					'px;
        left: ' +
					x() +
					'px;
        background: white;
        border: 1px solid black;
        border-radius: 16px;
        padding: 1rem;
      '
				"
			>
				<button (click)="close.emit()">X</button>
				This is a context menu
			</div>
		}
	`,
})
class ContextMenuComponent {
	contextMenu = viewChild("contextMenu", { read: ElementRef<HTMLElement> });

	isOpen = input<boolean>();
	x = input<number>();
	y = input<number>();

	close = output();

	focus() {
		this.contextMenu()?.nativeElement?.focus();
	}

	closeIfOutsideOfContext = (e: MouseEvent) => {
		const contextMenuEl = this.contextMenu()?.nativeElement;
		if (!contextMenuEl) return;
		const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
		if (isClickInside) return;
		this.close.emit();
	};

	constructor() {
		afterRenderEffect((onCleanup) => {
			document.addEventListener("click", this.closeIfOutsideOfContext);

			onCleanup(() => {
				document.removeEventListener("click", this.closeIfOutsideOfContext);
			});
		});
	}
}

@Component({
	selector: "app-root",
	imports: [ContextMenuComponent],
	template: `
		<div style="margin-top: 5rem; margin-left: 5rem">
			<div #contextOrigin (contextmenu)="open($event)">Right click on me!</div>
		</div>
		<context-menu
			#contextMenu
			(close)="close()"
			[isOpen]="isOpen()"
			[x]="mouseBounds().x"
			[y]="mouseBounds().y"
		/>
	`,
})
class AppComponent {
	contextMenu = viewChild.required("contextMenu", {
		read: ContextMenuComponent,
	});

	isOpen = signal(false);

	mouseBounds = signal({
		x: 0,
		y: 0,
	});

	close() {
		this.isOpen.set(false);
	}

	open(e: MouseEvent) {
		e.preventDefault();
		this.isOpen.set(true);
		this.mouseBounds.set({
			x: e.clientX,
			y: e.clientY,
		});
		setTimeout(() => {
			this.contextMenu().focus();
		}, 0);
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
