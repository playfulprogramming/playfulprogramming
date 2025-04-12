import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnInit, ContentChild, ElementRef } from "@angular/core";

@Component({
	selector: "parent-list",
	standalone: true,
	template: ` <ng-content></ng-content> `,
})
class ParentListComponent implements OnInit {
	@ContentChild("childItem") child!: ElementRef<HTMLElement>;

	ngOnInit() {
		console.log(this.child); // This is `undefined`
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ParentListComponent],
	template: `
		<parent-list>
			<p #childItem>Hello, world!</p>
		</parent-list>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
