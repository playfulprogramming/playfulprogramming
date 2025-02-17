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
class UserValue {
	name = "";
}

@Component({
	selector: "great-grand-child",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: ` <p>Name: {{ user.name }}</p> `,
})
class GreatGrandChildComponent {
	// Nothing will display, because we switched the user
	// type halfway through the component tree
	user = inject(UserValue);
}

@Component({
	selector: "grand-child",
	providers: [
		{
			provide: UserValue,
			useValue: { firstName: "Corbin", lastName: "Crutchley" },
		},
	],
	imports: [GreatGrandChildComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<great-grand-child />`,
})
class GrandChildComponent {}

@Component({
	selector: "child-comp",
	imports: [GrandChildComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<grand-child />`,
})
class ChildComponent {}

@Component({
	selector: "app-root",
	providers: [{ provide: UserValue, useValue: { name: "Corbin Crutchley" } }],
	imports: [ChildComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<child-comp />`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
