import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
	QueryList,
	ViewChild,
	ViewChildren,
} from "@angular/core";

@Component({
	selector: "context-menu",
	standalone: true,
	imports: [],
	template: `
		@if (isOpen) {
			<div
				tabIndex="0"
				#contextMenu
				[style]="
					'
        position: fixed;
        top: ' +
					y +
					'px;
        left: ' +
					x +
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
class ContextMenuComponent implements AfterViewInit, OnDestroy {
	@ViewChild("contextMenu") contextMenu!: ElementRef<HTMLElement>;

	@Input() isOpen!: boolean;
	@Input() x!: number;
	@Input() y!: number;

	@Output() close = new EventEmitter();

	focus() {
		this.contextMenu?.nativeElement?.focus();
	}

	closeIfOutsideOfContext = (e: MouseEvent) => {
		const contextMenuEl = this.contextMenu?.nativeElement;
		if (!contextMenuEl) return;
		const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
		if (isClickInside) return;
		this.close.emit();
	};

	ngAfterViewInit() {
		document.addEventListener("click", this.closeIfOutsideOfContext);
	}

	ngOnDestroy() {
		document.removeEventListener("click", this.closeIfOutsideOfContext);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ContextMenuComponent],
	template: `
		<div style="margin-top: 5rem; margin-left: 5rem">
			<div #contextOrigin (contextmenu)="open($event)">Right click on me!</div>
		</div>
		<context-menu
			#contextMenu
			(close)="close()"
			[isOpen]="isOpen"
			[x]="mouseBounds.x"
			[y]="mouseBounds.y"
		/>
	`,
})
class AppComponent {
	@ViewChild("contextMenu") contextMenu!: ContextMenuComponent;

	isOpen = false;

	mouseBounds = {
		x: 0,
		y: 0,
	};

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
		setTimeout(() => {
			this.contextMenu.focus();
		}, 0);
	}
}

bootstrapApplication(AppComponent);
