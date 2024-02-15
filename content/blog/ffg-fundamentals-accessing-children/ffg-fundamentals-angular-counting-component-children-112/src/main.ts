import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	AfterContentInit,
	ContentChildren,
	QueryList,
} from "@angular/core";

@Component({
	selector: "parent-list",
	standalone: true,
	template: `
		<p>There are {{ children.length }} number of items in this array</p>
		<ul>
			<ng-content></ng-content>
		</ul>
	`,
})
class ParentListComponent implements AfterContentInit {
	@ContentChildren("listItem") children!: QueryList<HTMLElement>;

	ngAfterContentInit() {
		console.log(this.children);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
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

bootstrapApplication(AppComponent);
