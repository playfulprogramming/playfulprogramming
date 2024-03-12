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
			{{ text }}
		</button>
	`,
})
class ToggleButtonComponent {
	@Input() text!: string;
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
		<toggle-button text="Hello world!" />
		<toggle-button text="Hello other friends!" />
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
