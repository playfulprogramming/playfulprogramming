import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ElementRef,
	viewChild,
	signal,
	afterRenderEffect,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="margin-top: 5rem; margin-left: 5rem">
			<div (contextmenu)="open($event)">Right click on me!</div>
		</div>
		@if (isOpen()) {
			<div
				tabIndex="0"
				#contextMenu
				style="
      position: fixed;
      top: {{ mouseBounds().y }}px;
      left: {{ mouseBounds().x }}px;
      background: white;
      border: 1px solid black;
      border-radius: 16px;
      padding: 1rem;
				"
			>
				<button (click)="close()">X</button>
				This is a context menu
			</div>
		}
	`,
})
class AppComponent {
	contextMenu = viewChild("contextMenu", { read: ElementRef<HTMLElement> });

	isOpen = signal(false);

	mouseBounds = signal({
		x: 0,
		y: 0,
	});

	closeIfOutsideOfContext = (e: MouseEvent) => {
		const contextMenuEl = this.contextMenu()?.nativeElement;
		if (!contextMenuEl) return;
		const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
		if (isClickInside) return;
		this.isOpen.set(false);
	};

	constructor() {
		afterRenderEffect((onCleanup) => {
			document.addEventListener("click", this.closeIfOutsideOfContext);
			onCleanup(() => {
				document.removeEventListener("click", this.closeIfOutsideOfContext);
			});
		});
	}

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
		// Wait until the element is rendered before focusing it
		setTimeout(() => {
			this.contextMenu()?.nativeElement.focus();
		}, 0);
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
