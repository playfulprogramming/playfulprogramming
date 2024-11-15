import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "app-root",
	template: ` <p>Hello, world!</p> `,
})
class AppComponent {
	// This will prevent rendering
	constructor() {
		throw new Error("Error in constructor");
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
