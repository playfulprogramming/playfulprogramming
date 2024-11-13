import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, input, output } from "@angular/core";

@Component({
	selector: "file-action-buttons",
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
	delete = output();
	copy = output();
	favorite = output();
}

@Component({
	selector: "button-bar",
	imports: [FileActionButtonsComponent],
	template: `
		<div style="display: flex; gap: 1rem">
			@if (fileSelected()) {
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
	fileSelected = input<boolean>();

	delete = output();
	copy = output();
	favorite = output();
	settings = output();
}

@Component({
	selector: "app-root",
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
