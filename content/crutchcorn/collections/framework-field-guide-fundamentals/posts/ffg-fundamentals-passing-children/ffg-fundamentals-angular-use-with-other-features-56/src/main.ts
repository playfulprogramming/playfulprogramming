import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
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
	selector: "rainbow-exclamation-mark",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <span>!</span> `,
	// These styles will only apply to this component
	styles: [
		`
			span {
				font-size: 3rem;
				background: linear-gradient(
					180deg,
					#fe0000 16.66%,
					#fd8c00 16.66%,
					33.32%,
					#ffe500 33.32%,
					49.98%,
					#119f0b 49.98%,
					66.64%,
					#0644b3 66.64%,
					83.3%,
					#c22edc 83.3%
				);
				background-size: 100%;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				-moz-background-clip: text;
			}
		`,
	],
})
class RainbowExclamationMarkComponent {}

@Component({
	selector: "toggle-button-list",
	imports: [ToggleButtonComponent, RainbowExclamationMarkComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<toggle-button>
			Hello
			@for (friend of friends; track friend) {
				<span>{{ friend }} </span>
			}
			!
		</toggle-button>
		<toggle-button>
			Hello other friends<rainbow-exclamation-mark />
		</toggle-button>
	`,
})
class ToggleButtonListComponent {
	friends = ["Kevin,", "Evelyn,", "and James"];
}

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
