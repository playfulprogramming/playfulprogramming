import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	AfterViewInit,
	Component,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
	inject,
} from "@angular/core";
import { PortalModule, TemplatePortal } from "@angular/cdk/portal";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [PortalModule],
	template: `
		<div style="height: 100px; width: 100px; border: 2px solid black;">
			<ng-template [cdkPortalOutlet]="domPortal" />
		</div>
		<ng-template #portalContent>Hello, this is a template portal</ng-template>
	`,
})
class AppComponent implements AfterViewInit {
	@ViewChild("portalContent") portalContent!: TemplateRef<unknown>;

	viewContainerRef = inject(ViewContainerRef);
	domPortal!: TemplatePortal<any>;

	ngAfterViewInit() {
		// This is to avoid an:
		// "Expression has changed after it was checked"
		// error when trying to set domPortal
		setTimeout(() => {
			this.domPortal = new TemplatePortal(
				this.portalContent,
				this.viewContainerRef,
			);
		}, 0);
	}
}

bootstrapApplication(AppComponent);
