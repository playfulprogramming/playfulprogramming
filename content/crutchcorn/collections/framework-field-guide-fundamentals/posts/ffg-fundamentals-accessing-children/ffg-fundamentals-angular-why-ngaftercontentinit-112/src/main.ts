import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	effect,
	contentChild,
	ElementRef,
	untracked,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "parent-list",
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
	imports: [ParentListComponent],
	template: `
		<parent-list>
			<p #childItem>Hello, world!</p>
		</parent-list>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
