import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	Injectable,
	OnDestroy,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
	inject,
} from "@angular/core";
import { Portal, PortalModule, TemplatePortal } from "@angular/cdk/portal";

@Injectable({
	providedIn: "root",
})
class PortalService {
	portal: Portal<any> | null = null;
}

@Component({
	selector: "modal-comp",
	standalone: true,
	template: ` <ng-template #portalContent>Hello, world!</ng-template> `,
})
class ModalComponent {
	@ViewChild("portalContent") portalContent!: TemplateRef<unknown>;

	viewContainerRef = inject(ViewContainerRef);
	domPortal!: TemplatePortal<any>;

	portalService = inject(PortalService);

	ngAfterViewInit() {
		// This is to avoid an:
		// "Expression has changed after it was checked"
		// error when trying to set domPortal
		setTimeout(() => {
			this.portalService.portal = new TemplatePortal(
				this.portalContent,
				this.viewContainerRef,
			);
		});
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [PortalModule, ModalComponent],
	template: `
		@if (portalService.portal) {
			<div style="height: 100px; width: 100px; border: 2px solid black;">
				<ng-template [cdkPortalOutlet]="portalService.portal" />
			</div>
		}
		<modal-comp />
	`,
})
class AppComponent {
	portalService = inject(PortalService);
}

bootstrapApplication(AppComponent);
