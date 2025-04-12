import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	effect,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <p>Hello, world!</p> `,
})
class AppComponent {
	// Will not prevent `Hello, world!` from showing
	constructor() {
		effect(() => {
			throw new Error("Error in constructor");
		});
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
