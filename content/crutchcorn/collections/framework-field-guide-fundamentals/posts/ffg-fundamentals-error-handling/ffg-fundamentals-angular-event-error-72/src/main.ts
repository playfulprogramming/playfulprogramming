import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "error-throwing",
	template: ` <button (click)="onClick()">Click me</button> `,
})
class ErrorThrowingComponent {
	onClick() {
		throw new Error("Error");
	}
}

@Component({
	selector: "app-root",
	imports: [ErrorThrowingComponent],
	template: `<error-throwing />`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
