import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	input,
	output,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "file-action-buttons",
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	fileSelected = input.required<boolean>();

	delete = output();
	copy = output();
	favorite = output();
	settings = output();
}

@Component({
	selector: "app-root",
	imports: [ButtonBarComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
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

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
