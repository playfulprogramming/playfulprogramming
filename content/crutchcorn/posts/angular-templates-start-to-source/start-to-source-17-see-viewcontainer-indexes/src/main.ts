import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
	EmbeddedViewRef,
} from "@angular/core";

@Component({
	selector: "my-app",
	standalone: true,
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
		const embeddRef: EmbeddedViewRef<any> =
			this.viewContainerRef.createEmbeddedView(this.templ);
		const embeddIndex = this.viewContainerRef.indexOf(embeddRef);
		console.log(embeddIndex);

		for (let i = 0; i < this.viewContainerRef.length; i++) {
			// This will complain about "Object too large to inspect."
			// Just open your browser's developer tools to see the object consoled
			console.log(this.viewContainerRef.get(i));
		}
	}
}

bootstrapApplication(AppComponent);
