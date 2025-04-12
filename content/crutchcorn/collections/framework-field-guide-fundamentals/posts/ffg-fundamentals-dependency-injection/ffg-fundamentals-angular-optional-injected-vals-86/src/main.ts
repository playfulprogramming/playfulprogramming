import { bootstrapApplication } from "@angular/platform-browser";
import {
	Injectable,
	Component,
	inject,
	OnInit,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Injectable()
class InjectedValue {
	message = "Hello, world";
}

@Component({
	selector: "child-comp",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (injectedValue) {
			<div>{{ injectedValue.message }}</div>
		}
		@if (!injectedValue) {
			<div>There is no injected value</div>
		}
	`,
})
class ChildComponent {
	injectedValue = inject(InjectedValue, { optional: true });

	constructor() {
		// undefined
		console.log(this.injectedValue);
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
