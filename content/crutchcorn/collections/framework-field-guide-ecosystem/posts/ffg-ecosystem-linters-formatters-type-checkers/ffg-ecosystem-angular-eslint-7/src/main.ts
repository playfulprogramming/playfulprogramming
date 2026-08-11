import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	provideZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: "<p>Hello, world!</p>",
})
export class AppThing {
	// This is deprecated code that ESLint will catch with Angular plugins configured
	constructor(@Inject(ChangeDetectorRef) private cd: ChangeDetectorRef) {}
}

void bootstrapApplication(AppThing, {
	providers: [provideZonelessChangeDetection()],
});
