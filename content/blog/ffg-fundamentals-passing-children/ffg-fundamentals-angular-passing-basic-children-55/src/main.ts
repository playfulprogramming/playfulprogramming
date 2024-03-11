import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Input } from "@angular/core";

@Component({
	selector: "toggle-button",
	standalone: true,
	template: `
		<button
			(click)="togglePressed()"
			[style]="
				pressed
					? 'background-color: black; color: white;'
					: 'background-color: white;color: black'
			"
			type="button"
			[attr.aria-pressed]="pressed"
		>
			<ng-content />
		</button>
	`,
})
class ToggleButtonComponent {
	pressed = false;
	togglePressed() {
		this.pressed = !this.pressed;
	}
}

@Component({
	selector: "toggle-button-list",
	standalone: true,
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
	standalone: true,
	imports: [ToggleButtonListComponent],
	template: ` <toggle-button-list /> `,
})
class AppComponent {}

bootstrapApplication(AppComponent);
