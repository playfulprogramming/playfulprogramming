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
	message = "Initial value";
}

@Component({
	selector: "child-comp",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<p>{{ injectedValue.message }}</p>`,
})
class ChildComponent {
	injectedValue = inject(InjectedValue);
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
