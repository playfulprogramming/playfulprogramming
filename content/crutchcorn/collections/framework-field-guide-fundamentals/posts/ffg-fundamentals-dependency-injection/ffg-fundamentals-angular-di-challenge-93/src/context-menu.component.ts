// context-menu.component.ts
import {
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChange,
	SimpleChanges,
	ViewChild,
} from "@angular/core";
import { LayoutComponent } from "./layout.component";

import { ActionTypes } from "./context";

function injectAndGetActions() {
	const context = inject(ActionTypes);
	if (!context) return [];
	return context.actions;
}

@Component({
	selector: "context-menu",
	standalone: true,
	template: `
		@if (isOpen && actions) {
			<div
				#contextMenu
				tabIndex="0"
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
				<button (click)="close.emit(false)">X</button>
				<ul>
					@for (action of actions; track action) {
						<li>
							<button (click)="action.fn(data); close.emit(false)">
								{{ action.label }}
							</button>
						</li>
					}
				</ul>
			</div>
		}
	`,
})
export class ContextMenuComponent implements OnInit, OnDestroy, OnChanges {
	@ViewChild("contextMenu", { static: false }) contextMenuRef!: ElementRef;
	@Input() isOpen!: boolean;
	@Input() x!: number;
	@Input() y!: number;
	@Input() data!: any;

	@Output() close = new EventEmitter<boolean>();

	actions = injectAndGetActions();

	closeIfOutside = (e: MouseEvent) => {
		const contextMenuEl = this.contextMenuRef?.nativeElement;
		if (!contextMenuEl) return;
		const isClickInside = contextMenuEl.contains(e.target);
		if (isClickInside) return;
		this.close.emit(false);
	};

	closeIfContextMenu = () => {
		if (!this.isOpen) return;
		this.close.emit(false);
	};

	previousListener: null | (() => void) = null;

	ngOnChanges(changes: SimpleChanges) {
		if (changes["isOpen"].previousValue !== changes["isOpen"].currentValue) {
			if (this.previousListener) {
				this.previousListener();
			}
			// Inside a timeout to make sure the initial context menu does not close the menu
			setTimeout(() => {
				document.addEventListener("contextmenu", this.closeIfContextMenu);
			}, 0);

			this.previousListener = () =>
				document.removeEventListener("contextmenu", this.closeIfContextMenu);
		}
	}

	ngOnInit() {
		document.addEventListener("click", this.closeIfOutside);
	}

	ngOnDestroy() {
		document.removeEventListener("click", this.closeIfOutside);
	}

	focusMenu() {
		this.contextMenuRef.nativeElement.focus();
	}
}
