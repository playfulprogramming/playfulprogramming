import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	signal,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "toggle-button",
	template: `
		<button
			(click)="togglePressed()"
			[style]="
				pressed()
					? 'background-color: black; color: white;'
					: 'background-color: white;color: black'
			"
			type="button"
			[attr.aria-pressed]="pressed()"
		>
			<ng-content />
		</button>
	`,
})
class ToggleButtonComponent {
	pressed = signal(false);
	togglePressed() {
		this.pressed.set(!this.pressed());
	}
}

@Component({
	selector: "toggle-button-list",
	imports: [ToggleButtonComponent],
	template: `
		<toggle-button>
			Hello <span style="font-weight: bold;">world</span>!
		</toggle-button>
		<toggle-button>Hello other friends!</toggle-button>
	`,
})
class ToggleButtonListComponent {}

@Component({
	selector: "app-root",
	imports: [ToggleButtonListComponent],
	template: ` <toggle-button-list /> `,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
