import { bootstrapApplication } from "@angular/platform-browser";
import {
	Injectable,
	Component,
	inject,
	OnInit,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Injectable()
class InjectedValue {
	message = "Hello, world";
}

@Component({
	selector: "child-comp",
	template: `<div>{{ injectedValue.message }}</div>`,
})
class ChildComponent {
	injectedValue = inject(InjectedValue);

	constructor() {
		console.log(this.injectedValue);
	}
}

@Component({
	selector: "app-root",
	imports: [ChildComponent],
	providers: [InjectedValue],
	template: `<child-comp />`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
