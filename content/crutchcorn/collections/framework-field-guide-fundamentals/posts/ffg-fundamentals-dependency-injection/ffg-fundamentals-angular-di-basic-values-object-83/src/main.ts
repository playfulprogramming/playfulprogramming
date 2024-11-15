import { bootstrapApplication } from "@angular/platform-browser";
import {
	InjectionToken,
	Component,
	inject,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

const WELCOME_MESSAGE_TOKEN = new InjectionToken<{ message: string }>(
	"WELCOME_MESSAGE",
);

@Component({
	selector: "child-comp",
	template: `<p>{{ welcomeMsg.message }}</p>`,
})
class ChildComponent {
	welcomeMsg = inject(WELCOME_MESSAGE_TOKEN);
}

@Component({
	selector: "app-root",
	imports: [ChildComponent],
	template: `<child-comp />`,
	providers: [
		{ provide: WELCOME_MESSAGE_TOKEN, useValue: { message: "Hello, world!" } },
	],
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
