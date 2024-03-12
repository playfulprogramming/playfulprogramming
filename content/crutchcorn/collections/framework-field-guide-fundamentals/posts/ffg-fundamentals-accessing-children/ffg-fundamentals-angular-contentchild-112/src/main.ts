import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	AfterContentInit,
	ContentChild,
	ElementRef,
} from "@angular/core";

@Component({
	selector: "parent-list",
	standalone: true,
	template: `<ng-content></ng-content>`,
})
class ParentListComponent implements AfterContentInit {
	@ContentChild("childItem") child!: ElementRef<HTMLElement>;

	// This cannot be replaced with an `OnInit`, otherwise `children` is empty. We'll explain soon.
	ngAfterContentInit() {
		console.log(this.child.nativeElement); // This is an HTMLElement
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
