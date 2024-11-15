import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	Injectable,
	TemplateRef,
	ViewContainerRef,
	inject,
	viewChild,
	afterRenderEffect,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

import { TemplatePortal, DomPortalOutlet } from "@angular/cdk/portal";

@Injectable({
	providedIn: "root",
})
class PortalService {
	outlet = new DomPortalOutlet(document.querySelector("body")!);
}

@Component({
	selector: "modal-comp",
	template: ` <ng-template #portalContent>Hello, world!</ng-template> `,
})
class ModalComponent {
	portalContent = viewChild.required("portalContent", { read: TemplateRef });

	viewContainerRef = inject(ViewContainerRef);

	portalService = inject(PortalService);

	constructor() {
		afterRenderEffect((onCleanup) => {
			this.portalService.outlet.attach(
				new TemplatePortal(this.portalContent(), this.viewContainerRef),
			);

			onCleanup(() => {
				this.portalService.outlet.detach();
			});
		});
	}
}

@Component({
	selector: "app-root",
	imports: [ModalComponent],
	template: `
		<!-- Even though it's rendered first, it shows up last because it's being appended to <body> -->
		<modal-comp />
		<div style="height: 100px; width: 100px; border: 2px solid black;"></div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
