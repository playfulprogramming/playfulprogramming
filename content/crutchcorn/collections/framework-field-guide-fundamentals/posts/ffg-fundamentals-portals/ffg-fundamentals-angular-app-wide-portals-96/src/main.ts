import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	Injectable,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
	inject,
	effect,
	signal,
	afterRenderEffect,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { Portal, PortalModule, TemplatePortal } from "@angular/cdk/portal";

@Injectable({
	providedIn: "root",
})
class PortalService {
	portal = signal<Portal<any> | null>(null);
}

@Component({
	selector: "modal-comp",
	template: ` <ng-template #portalContent>Hello, world!</ng-template> `,
})
class ModalComponent {
	@ViewChild("portalContent") portalContent!: TemplateRef<unknown>;

	viewContainerRef = inject(ViewContainerRef);

	portalService = inject(PortalService);

	constructor() {
		afterRenderEffect((onCleanup) => {
			this.portalService.portal.set(
				new TemplatePortal(this.portalContent, this.viewContainerRef),
			);

			onCleanup(() => {
				this.portalService.portal()?.detach();
			});
		});
	}
}

@Component({
	selector: "app-root",
	imports: [PortalModule, ModalComponent],
	template: `
		@if (portalService.portal()) {
			<div style="height: 100px; width: 100px; border: 2px solid black;">
				<ng-template [cdkPortalOutlet]="portalService.portal()" />
			</div>
		}
		<modal-comp />
	`,
})
class AppComponent {
	portalService = inject(PortalService);
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
