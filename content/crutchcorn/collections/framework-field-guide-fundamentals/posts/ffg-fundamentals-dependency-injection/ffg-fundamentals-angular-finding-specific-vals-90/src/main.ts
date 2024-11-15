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

@Injectable()
class FavFoodValue {
	favFood = "";
}

@Component({
	selector: "great-grand-child",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p>Name: {{ nameValue.name }}</p>
		<p>Favorite food: {{ favFoodValue.favFood }}</p>
	`,
})
class GreatGrandChildComponent {
	// Despite the `FavFoodContext` being closer, this is
	// specifically looking for the `NameValue` and will
	// go further up in the tree to find that data from `app-root`
	nameValue = inject(NameValue);
	// Meanwhile, this will search for the context that pertains to its name
	favFoodValue = inject(FavFoodValue);
}

@Component({
	selector: "grand-child",
	providers: [{ provide: FavFoodValue, useValue: { favFood: "Ice Cream" } }],
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
	providers: [{ provide: NameValue, useValue: { name: "Corbin" } }],
	imports: [ChildComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<child-comp />`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
