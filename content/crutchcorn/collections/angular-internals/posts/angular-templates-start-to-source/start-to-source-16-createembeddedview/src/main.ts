import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
} from "@angular/core";

@Component({
	selector: "my-app",
	template: `
		<ng-template #templ>
			<ul>
				<li>List Item 1</li>
				<li>List Item 2</li>
			</ul>
		</ng-template>
		<div #viewContainerRef class="testing"></div>
	`,
})
export class AppComponent implements OnInit {
	@ViewChild("viewContainerRef", { read: ViewContainerRef, static: true })
	viewContainerRef!: ViewContainerRef;
	@ViewChild("templ", { read: TemplateRef, static: true })
	templ!: TemplateRef<any>;

	ngOnInit() {
		this.viewContainerRef.createEmbeddedView(this.templ);
	}
}

bootstrapApplication(AppComponent);
