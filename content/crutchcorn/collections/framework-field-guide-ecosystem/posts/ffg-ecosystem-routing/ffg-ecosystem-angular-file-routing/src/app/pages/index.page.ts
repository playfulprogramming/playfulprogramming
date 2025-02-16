import { Component } from "@angular/core";

@Component({
	selector: "app-home",
	standalone: true,
	template: `
		<h1>Home</h1>
		<a href="/other">Other</a>
	`,
})
export default class HomeComponent {}
