import { bootstrapApplication } from "@angular/platform-browser";

import { PortalModule, DomPortal } from "@angular/cdk/portal";
import {
	Component,
	ElementRef,
	provideExperimentalZonelessChangeDetection,
	afterRenderEffect,
	signal,
	viewChild,
} from "@angular/core";

@Component({
	selector: "app-root",
	imports: [PortalModule],
	template: `
		<div style="height: 100px; width: 100px; border: 2px solid black;">
			@if (domPortal()) {
				<ng-template [cdkPortalOutlet]="domPortal()" />
			}
		</div>
		<div #portalContent>Hello world!</div>
	`,
})
class AppComponent {
	portalContent = viewChild.required("portalContent", {
		read: ElementRef<HTMLElement>,
	});

	domPortal = signal<DomPortal<any> | null>(null);

	constructor() {
		afterRenderEffect((onCleanup) => {
			this.domPortal.set(new DomPortal(this.portalContent()));

			onCleanup(() => {
				this.domPortal()?.detach();
			});
		});
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
