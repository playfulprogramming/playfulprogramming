import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ViewContainerRef,
	OnInit,
	ViewChild,
	TemplateRef,
	EmbeddedViewRef,
} from "@angular/core";

@Component({
	selector: "my-app",
	template: `
		<ng-template #templ let-i>
			<li>List Item {{ i }}</li>
			<li>List Item {{ i + 1 }}</li>
		</ng-template>
		<ul>
			<ng-container #viewContainerRef></ng-container>
		</ul>
	`,
})
export class AppComponent implements OnInit {
	@ViewChild("viewContainerRef", { read: ViewContainerRef, static: true })
	viewContainerRef!: ViewContainerRef;
	@ViewChild("templ", { read: TemplateRef, static: true })
	templ!: TemplateRef<any>;

	ngOnInit() {
		const embeddRef3: EmbeddedViewRef<any> =
			this.viewContainerRef.createEmbeddedView(this.templ, { $implicit: 3 });
		const embeddRef1: EmbeddedViewRef<any> =
			this.viewContainerRef.createEmbeddedView(this.templ, { $implicit: 1 });
		const newViewIndex = 0;
		this.viewContainerRef.move(embeddRef1, newViewIndex);
	}
}

bootstrapApplication(AppComponent);
