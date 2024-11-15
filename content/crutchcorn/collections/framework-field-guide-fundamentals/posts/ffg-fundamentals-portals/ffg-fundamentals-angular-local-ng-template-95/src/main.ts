import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	TemplateRef,
	ViewContainerRef,
	inject,
	afterRenderEffect,
	viewChild,
	signal,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
} from "@angular/core";
import { PortalModule, TemplatePortal } from "@angular/cdk/portal";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [PortalModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="height: 100px; width: 100px; border: 2px solid black;">
			@if (templatePortal()) {
				<ng-template [cdkPortalOutlet]="templatePortal()" />
			}
		</div>
		<ng-template #portalContent>Hello, this is a template portal</ng-template>
	`,
})
class AppComponent {
	portalContent = viewChild.required("portalContent", {
		read: TemplateRef<unknown>,
	});

	viewContainerRef = inject(ViewContainerRef);
	templatePortal = signal<TemplatePortal | null>(null);

	constructor() {
		afterRenderEffect((onCleanup) => {
			this.templatePortal.set(
				new TemplatePortal(this.portalContent(), this.viewContainerRef),
			);

			onCleanup(() => {
				this.templatePortal()?.detach();
			});
		});
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
