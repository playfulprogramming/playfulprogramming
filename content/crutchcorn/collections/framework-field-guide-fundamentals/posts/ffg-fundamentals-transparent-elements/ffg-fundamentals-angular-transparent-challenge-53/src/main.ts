import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "file-action-buttons",
	standalone: true,
	template: `
		<button (click)="delete.emit()">Delete</button>
		<button (click)="copy.emit()">Copy</button>
		<button (click)="favorite.emit()">Favorite</button>
	`,
	styles: [
		`
			:host {
				display: contents;
			}
		`,
	],
})
class FileActionButtonsComponent {
	@Output() delete = new EventEmitter();
	@Output() copy = new EventEmitter();
	@Output() favorite = new EventEmitter();
}

@Component({
	selector: "button-bar",
	standalone: true,
	imports: [FileActionButtonsComponent],
	template: `
		<div style="display: flex; gap: 1rem">
			@if (fileSelected) {
				<file-action-buttons
					(delete)="delete.emit()"
					(copy)="copy.emit()"
					(favorite)="favorite.emit()"
				/>
			}
			<button (click)="settings.emit()">Settings</button>
		</div>
	`,
})
class ButtonBarComponent {
	@Input() fileSelected!: boolean;

	@Output() delete = new EventEmitter();
	@Output() copy = new EventEmitter();
	@Output() favorite = new EventEmitter();
	@Output() settings = new EventEmitter();
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ButtonBarComponent],
	template: `
		<button-bar
			[fileSelected]="true"
			(delete)="alertMe('delete')"
			(copy)="alertMe('copy')"
			(favorite)="alertMe('favorite')"
			(settings)="alertMe('settings')"
		/>
	`,
})
class AppComponent {
	alertMe(str: string) {
		alert("You have pressed on " + str);
	}
}

bootstrapApplication(AppComponent);
