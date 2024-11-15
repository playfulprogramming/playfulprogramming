// context-menu.component.ts
import {
	Component,
	effect,
	ElementRef,
	inject,
	input,
	output,
	viewChild,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

import { ActionTypes } from "./context";

function injectAndGetActions() {
	const context = inject(ActionTypes);
	if (!context) return [];
	return context.actions;
}

@Component({
	selector: "context-menu",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (isOpen() && actions) {
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
							<button (click)="action.fn(data()); close.emit(false)">
								{{ action.label }}
							</button>
						</li>
					}
				</ul>
			</div>
		}
	`,
})
export class ContextMenuComponent {
	contextMenuRef = viewChild("contextMenu", { read: ElementRef });
	isOpen = input.required<boolean>();
	x = input.required<number>();
	y = input.required<number>();
	data = input.required<any>();

	close = output<boolean>();

	actions = injectAndGetActions();

	closeIfOutside = (e: MouseEvent) => {
		const contextMenuEl = this.contextMenuRef()?.nativeElement;
		if (!contextMenuEl) return;
		const isClickInside = contextMenuEl.contains(e.target);
		if (isClickInside) return;
		this.close.emit(false);
	};

	closeIfContextMenu = () => {
		if (!this.isOpen) return;
		this.close.emit(false);
	};

	constructor() {
		let previousIsOpen = false;
		effect((onCleanup) => {
			const isSame = previousIsOpen === this.isOpen();
			previousIsOpen = this.isOpen();
			if (isSame) return;
			// Inside a timeout to make sure the initial context menu does not close the menu
			setTimeout(() => {
				document.addEventListener("contextmenu", this.closeIfContextMenu);
			}, 0);

			onCleanup(() => {
				document.removeEventListener("contextmenu", this.closeIfContextMenu);
			});
		});

		effect((onCleanup) => {
			document.addEventListener("click", this.closeIfOutside);

			onCleanup(() => {
				document.removeEventListener("click", this.closeIfOutside);
			});
		});
	}

	focusMenu() {
		this.contextMenuRef()?.nativeElement.focus();
	}
}
