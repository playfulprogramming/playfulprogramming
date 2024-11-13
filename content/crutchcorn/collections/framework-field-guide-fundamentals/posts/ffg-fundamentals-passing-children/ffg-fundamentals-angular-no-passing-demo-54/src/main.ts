import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, input, signal } from "@angular/core";

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
			{{ text() }}
		</button>
	`,
})
class ToggleButtonComponent {
	text = input.required<string>();
	pressed = signal(false);
	togglePressed() {
		this.pressed.set(!this.pressed());
	}
}

@Component({
	selector: "toggle-button-list",
	imports: [ToggleButtonComponent],
	template: `
		<toggle-button text="Hello world!" />
		<toggle-button text="Hello other friends!" />
	`,
})
class ToggleButtonListComponent {}

@Component({
	selector: "app-root",
	imports: [ToggleButtonListComponent],
	template: ` <toggle-button-list /> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
