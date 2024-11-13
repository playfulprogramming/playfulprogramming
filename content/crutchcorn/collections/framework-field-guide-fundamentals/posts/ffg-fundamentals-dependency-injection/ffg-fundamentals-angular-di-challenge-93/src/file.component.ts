// file.component.ts
import {
	Component,
	input,
	Input,
	signal,
	viewChild,
	ViewChild,
} from "@angular/core";
import { ContextMenuComponent } from "./context-menu.component";

@Component({
	selector: "file-item",
	imports: [ContextMenuComponent],
	template: `
		<button
			(contextmenu)="onContextMenu($event)"
			style="display: block; width: 100%; margin-bottom: 1rem"
		>
			{{ name() }}
		</button>
		<context-menu
			#contextMenu
			[data]="id()"
			[isOpen]="isOpen()"
			(close)="setIsOpen(false)"
			[x]="mouseBounds().x"
			[y]="mouseBounds().y"
		/>
	`,
})
export class FileComponent {
	contextMenu = viewChild.required("contextMenu", {
		read: ContextMenuComponent,
	});
	name = input.required<string>();
	id = input.required<number>();

	mouseBounds = signal({
		x: 0,
		y: 0,
	});

	isOpen = signal(false);

	setIsOpen = (v: boolean) => this.isOpen.set(v);

	onContextMenu(e: MouseEvent) {
		e.preventDefault();
		this.isOpen.set(true);
		this.mouseBounds.set({
			x: e.clientX,
			y: e.clientY,
		});
		setTimeout(() => {
			this.contextMenu().focusMenu();
		}, 0);
	}
}
