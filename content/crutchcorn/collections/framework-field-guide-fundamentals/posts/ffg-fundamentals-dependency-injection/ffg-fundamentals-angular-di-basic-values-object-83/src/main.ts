import { bootstrapApplication } from "@angular/platform-browser";
import {
	InjectionToken,
	Component,
	inject,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

const WELCOME_MESSAGE_TOKEN = new InjectionToken<{ message: string }>(
	"WELCOME_MESSAGE",
);

@Component({
	selector: "child-comp",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<p>{{ welcomeMsg.message }}</p>`,
})
class ChildComponent {
	welcomeMsg = inject(WELCOME_MESSAGE_TOKEN);
}

@Component({
	selector: "app-root",
	imports: [ChildComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<child-comp />`,
	providers: [
		{ provide: WELCOME_MESSAGE_TOKEN, useValue: { message: "Hello, world!" } },
	],
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
