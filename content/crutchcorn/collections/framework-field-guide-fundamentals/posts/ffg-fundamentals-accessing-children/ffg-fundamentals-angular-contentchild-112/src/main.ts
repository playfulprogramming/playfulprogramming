import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ElementRef,
	contentChild,
	afterRenderEffect,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";

@Component({
	selector: "parent-list",
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	changeDetection: ChangeDetectionStrategy.OnPush,
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
