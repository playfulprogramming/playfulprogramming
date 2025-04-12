import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "error-throwing",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <p>Hello, world!</p> `,
})
class ErrorThrowingComponent {
	constructor() {
		throw new Error("Error");
	}
}

@Component({
	selector: "app-root",
	imports: [ErrorThrowingComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<error-throwing />`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
