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
import { NgIf } from "@angular/common";
import { TemplatePortal, DomPortalOutlet } from "@angular/cdk/portal";

@Injectable({
	providedIn: "root",
})
class PortalService {
	outlet = new DomPortalOutlet(document.querySelector("body")!);
}

@Component({
	selector: "modal-comp",
	standalone: true,
	template: ` <ng-template #portalContent>Hello, world!</ng-template> `,
})
class ModalComponent implements OnDestroy {
	@ViewChild("portalContent") portalContent!: TemplateRef<unknown>;

	viewContainerRef = inject(ViewContainerRef);
	domPortal!: TemplatePortal<any>;

	portalService = inject(PortalService);

	ngAfterViewInit() {
		// This is to avoid an:
		// "Expression has changed after it was checked"
		// error when trying to set domPortal
		setTimeout(() => {
			this.portalService.outlet.attach(
				new TemplatePortal(this.portalContent, this.viewContainerRef),
			);
		});
	}

	ngOnDestroy() {
		this.portalService.outlet.detach();
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ModalComponent],
	template: `
		<!-- Even though it's rendered first, it shows up last because it's being appended to <body> -->
		<modal-comp />
		<div style="height: 100px; width: 100px; border: 2px solid black;"></div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
