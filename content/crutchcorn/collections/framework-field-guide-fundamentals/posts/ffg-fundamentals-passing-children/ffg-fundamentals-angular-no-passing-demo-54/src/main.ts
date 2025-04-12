import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	input,
	signal,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "toggle-button",
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<toggle-button text="Hello world!" />
		<toggle-button text="Hello other friends!" />
	`,
})
class ToggleButtonListComponent {}

@Component({
	selector: "app-root",
	imports: [ToggleButtonListComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <toggle-button-list /> `,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
