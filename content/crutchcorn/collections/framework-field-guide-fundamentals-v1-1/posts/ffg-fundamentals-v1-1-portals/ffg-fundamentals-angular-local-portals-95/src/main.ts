import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { PortalModule, DomPortal } from "@angular/cdk/portal";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [PortalModule],
	template: `
		<div style="height: 100px; width: 100px; border: 2px solid black;">
			<ng-template [cdkPortalOutlet]="domPortal" />
		</div>
		<div #portalContent>Hello world!</div>
	`,
})
class AppComponent implements AfterViewInit {
	@ViewChild("portalContent") portalContent!: ElementRef<HTMLElement>;

	domPortal!: DomPortal<any>;

	ngAfterViewInit() {
		// This is to avoid an:
		// "Expression has changed after it was checked"
		// error when trying to set domPortal
		setTimeout(() => {
			this.domPortal = new DomPortal(this.portalContent);
		}, 0);
	}
}

bootstrapApplication(AppComponent);
