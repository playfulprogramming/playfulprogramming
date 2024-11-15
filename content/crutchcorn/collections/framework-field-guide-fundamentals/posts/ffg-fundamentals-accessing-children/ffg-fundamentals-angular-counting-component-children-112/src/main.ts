import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	contentChildren,
	afterRenderEffect,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "parent-list",
	template: `
		<p>There are {{ children().length }} number of items in this array</p>
		<ul>
			<ng-content></ng-content>
		</ul>
	`,
})
class ParentListComponent {
	children = contentChildren<HTMLElement>("listItem");

	constructor() {
		afterRenderEffect(() => {
			console.log(this.children());
		});
	}
}

@Component({
	selector: "app-root",
	imports: [ParentListComponent],
	template: `
		<parent-list>
			<li #listItem>Item 1</li>
			<li #listItem>Item 2</li>
			<li #listItem>Item 3</li>
		</parent-list>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
