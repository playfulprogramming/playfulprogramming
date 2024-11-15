import { bootstrapApplication } from "@angular/platform-browser";

import {
	afterRenderEffect,
	Component,
	ElementRef,
	input,
	output,
	signal,
	viewChild,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "context-menu",
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	contextMenu = viewChild("contextMenu", {
		read: ElementRef<HTMLElement>,
	});

	isOpen = input.required<boolean>();
	x = input.required<number>();
	y = input.required<number>();

	close = output();

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
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="margin-top: 5rem; margin-left: 5rem">
			<div #contextOrigin (contextmenu)="open($event)">Right click on me!</div>
		</div>
		<context-menu
			(close)="close()"
			[isOpen]="isOpen()"
			[x]="mouseBounds().x"
			[y]="mouseBounds().y"
		/>
	`,
})
class AppComponent {
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
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
