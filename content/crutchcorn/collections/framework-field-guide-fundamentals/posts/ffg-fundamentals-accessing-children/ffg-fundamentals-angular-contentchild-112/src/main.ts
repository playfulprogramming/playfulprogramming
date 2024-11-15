import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ElementRef,
	contentChild,
	afterRenderEffect,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "parent-list",
	template: `<ng-content></ng-content>`,
})
class ParentListComponent {
	child = contentChild.required<ElementRef<HTMLElement>>("childItem");

	constructor() {
		afterRenderEffect(() => {
			console.log(this.child().nativeElement); // This is an HTMLElement
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
