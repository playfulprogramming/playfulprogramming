import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	effect,
	contentChild,
	ElementRef,
	untracked,
} from "@angular/core";

@Component({
	selector: "parent-list",
	standalone: true,
	template: ` <ng-content></ng-content> `,
})
class ParentListComponent {
	child = contentChild.required<ElementRef<HTMLElement>>("childItem");

	constructor() {
		effect(() => {
			// TODO: This is not really undefined - it's ElementRef<HTMLElement> but... Why???
			console.log(untracked(this.child)); // This is `undefined`
		});
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
