import { bootstrapApplication } from "@angular/platform-browser";
import {
	Injectable,
	Component,
	inject,
	OnInit,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Injectable()
class UserValue {
	name = "";
}

@Component({
	selector: "great-grand-child",
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
	template: `<great-grand-child />`,
})
class GrandChildComponent {}

@Component({
	selector: "child-comp",
	imports: [GrandChildComponent],
	template: `<grand-child />`,
})
class ChildComponent {}

@Component({
	selector: "app-root",
	providers: [{ provide: UserValue, useValue: { name: "Corbin Crutchley" } }],
	imports: [ChildComponent],
	template: `<child-comp />`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
