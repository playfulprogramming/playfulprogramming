import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { Injectable, Component, inject, OnInit } from "@angular/core";

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
	standalone: true,
	imports: [],
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
	standalone: true,
	providers: [{ provide: FavFoodValue, useValue: { favFood: "Ice Cream" } }],
	imports: [GreatGrandChildComponent],
	template: `<great-grand-child />`,
})
class GrandChildComponent {}

@Component({
	selector: "child-comp",
	standalone: true,
	imports: [GrandChildComponent],
	template: `<grand-child />`,
})
class ChildComponent {}

@Component({
	selector: "app-root",
	standalone: true,
	providers: [{ provide: NameValue, useValue: { name: "Corbin" } }],
	imports: [ChildComponent],
	template: `<child-comp />`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
