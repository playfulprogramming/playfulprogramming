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
class NameValue {
	name = "";
}

@Component({
	selector: "great-grand-child",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<p>Name: {{ nameValue.name }}</p>`,
})
class GreatGrandChildComponent {
	nameValue = inject(NameValue);
}

@Component({
	selector: "grand-child",
	// Notice the new provider here, it will supplement the `App` injected value
	// for all child components of `grand-child`
	providers: [{ provide: NameValue, useValue: { name: "Kevin" } }],
	imports: [GreatGrandChildComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<great-grand-child />`,
})
class GrandChildComponent {}

@Component({
	selector: "child-comp",
	imports: [GrandChildComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p>Name: {{ nameValue.name }}</p>
		<grand-child />
	`,
})
class ChildComponent {
	nameValue = inject(NameValue);
}

@Component({
	selector: "app-root",
	providers: [{ provide: NameValue, useValue: { name: "Corbin" } }],
	imports: [ChildComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<child-comp />`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
