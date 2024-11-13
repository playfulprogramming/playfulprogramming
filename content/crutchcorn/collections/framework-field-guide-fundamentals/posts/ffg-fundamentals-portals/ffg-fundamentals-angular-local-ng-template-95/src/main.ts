import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, effect, ElementRef, viewChild } from "@angular/core";
import { PortalModule, DomPortal } from "@angular/cdk/portal";

@Component({
	selector: "app-root",
	imports: [PortalModule],
	template: `
		<div style="height: 100px; width: 100px; border: 2px solid black;">
			<ng-template [cdkPortalOutlet]="domPortal" />
		</div>
		<div #portalContent>Hello world!</div>
	`,
})
class AppComponent {
	portalContent = viewChild.required("portalContent", {
		read: ElementRef<HTMLElement>,
	});

	domPortal!: DomPortal<any>;

	constructor() {
		effect((onCleanup) => {
			this.domPortal = new DomPortal(this.portalContent());

			onCleanup(() => {
				this.domPortal.detach();
			});
		});
	}
}

bootstrapApplication(AppComponent);
