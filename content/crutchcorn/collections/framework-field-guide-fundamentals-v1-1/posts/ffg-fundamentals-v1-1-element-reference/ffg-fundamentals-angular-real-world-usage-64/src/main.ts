import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ElementRef,
	AfterViewInit,
	OnDestroy,
	ViewChild,
} from "@angular/core";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [],
	template: `
		<div style="margin-top: 5rem; margin-left: 5rem">
			<div (contextmenu)="open($event)">Right click on me!</div>
		</div>
		@if (isOpen) {
			<div
				tabIndex="0"
				#contextMenu
				[style]="
					'
      position: fixed;
      top: ' +
					mouseBounds.y +
					'px;
      left: ' +
					mouseBounds.x +
					'px;
      background: white;
      border: 1px solid black;
      border-radius: 16px;
      padding: 1rem;
    '
				"
			>
				<button (click)="close()">X</button>
				This is a context menu
			</div>
		}
	`,
})
class AppComponent implements AfterViewInit, OnDestroy {
	@ViewChild("contextMenu") contextMenu!: ElementRef<HTMLElement>;

	isOpen = false;

	mouseBounds = {
		x: 0,
		y: 0,
	};

	closeIfOutsideOfContext = (e: MouseEvent) => {
		const contextMenuEl = this.contextMenu?.nativeElement;
		if (!contextMenuEl) return;
		const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
		if (isClickInside) return;
		this.isOpen = false;
	};

	ngAfterViewInit() {
		document.addEventListener("click", this.closeIfOutsideOfContext);
	}

	ngOnDestroy() {
		document.removeEventListener("click", this.closeIfOutsideOfContext);
	}

	close() {
		this.isOpen = false;
	}

	open(e: MouseEvent) {
		e.preventDefault();
		this.isOpen = true;
		this.mouseBounds = {
			x: e.clientX,
			y: e.clientY,
		};
		// Wait until the element is rendered before focusing it
		setTimeout(() => {
			this.contextMenu.nativeElement.focus();
		}, 0);
	}
}

bootstrapApplication(AppComponent);
