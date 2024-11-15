import { bootstrapApplication } from "@angular/platform-browser";

import {
	Directive,
	Component,
	inject,
	Injectable,
	TemplateRef,
	ViewContainerRef,
	ViewEncapsulation,
	afterRenderEffect,
	input,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { DomPortal, DomPortalOutlet } from "@angular/cdk/portal";

@Injectable({
	providedIn: "root",
})
class PortalService {
	outlet = new DomPortalOutlet(document.querySelector("body")!);
}

@Directive({
	selector: "[tooltip]",
})
class TooltipDirective {
	tooltip = input.required<HTMLElement>();
	viewContainerRef = inject(ViewContainerRef);
	templToRender = inject(TemplateRef);

	portalService = inject(PortalService);

	el: HTMLElement | null = null;

	showTooltip = () => {
		const { left, bottom } = this.tooltip().getBoundingClientRect();

		const viewRef = this.viewContainerRef.createEmbeddedView(
			this.templToRender,
		);

		// We need to access the `div` itself to attach to a DomPortal; this is how you do that.
		this.el = viewRef.rootNodes[0] as HTMLElement;

		// Now that we have the element reference, we can add a class and style properties
		this.el.classList.add("tooltip");
		this.el.style.left = `${left}px`;
		this.el.style.top = `${bottom}px`;

		setTimeout(() => {
			this.portalService.outlet.attach(
				// DOMPortal allows us to attach a DOM element to the portal
				new DomPortal(this.el),
			);
		});
	};

	hideTooltip = () => {
		// Detaching the portal does not remove the element from the DOM when using DomPortal rather than TemplatePortal
		this.portalService.outlet.detach();
		this.el?.remove();
	};

	constructor() {
		afterRenderEffect((onCleanup) => {
			this.tooltip().addEventListener("mouseenter", () => {
				this.showTooltip();
			});
			this.tooltip().addEventListener("mouseleave", () => {
				this.hideTooltip();
			});

			onCleanup(() => {
				this.hideTooltip();
			});
		});
	}
}

@Component({
	selector: "app-root",
	imports: [TooltipDirective],
	template: `
		<div>
			<button #tooltipBase>Hover me</button>
			<div *tooltip="tooltipBase">This is a tooltip</div>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	styles: [
		`
			.tooltip {
				position: absolute;
				background-color: #333;
				color: #fff;
				padding: 8px;
				border-radius: 4px;
				z-index: 1000;
			}
		`,
	],
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
