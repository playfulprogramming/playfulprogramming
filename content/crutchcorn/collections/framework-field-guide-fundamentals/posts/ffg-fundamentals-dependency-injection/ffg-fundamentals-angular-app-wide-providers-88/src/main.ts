import { bootstrapApplication } from "@angular/platform-browser";
import {
	Injectable,
	Component,
	inject,
	effect,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Injectable({ providedIn: "root" })
class InjectedValue {
	message = "Hello, world";
}

@Component({
	selector: "child-comp",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<div>{{ injectedValue.message }}</div>`,
})
class ChildComponent {
	injectedValue = inject(InjectedValue);

	constructor() {
		effect(() => {
			// This will include the `message` property, alongside
			// any other methods and properties on the class instance
			console.log(this.injectedValue);
		});
	}
}

@Component({
	selector: "app-root",
	imports: [ChildComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<child-comp />`,
})
class ParentComponent {}

bootstrapApplication(ParentComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
