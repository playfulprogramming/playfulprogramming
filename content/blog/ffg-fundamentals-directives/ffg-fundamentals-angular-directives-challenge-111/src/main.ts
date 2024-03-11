import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Directive,
	Component,
	inject,
	Injectable,
	Input,
	OnDestroy,
	TemplateRef,
	ViewContainerRef,
	ViewEncapsulation,
	AfterViewInit,
} from "@angular/core";
import { DomPortal, DomPortalOutlet } from "@angular/cdk/portal";

@Injectable({
	providedIn: "root",
})
class PortalService {
	outlet = new DomPortalOutlet(
		document.querySelector("body")!,
		undefined,
		undefined,
		undefined,
		document,
	);
}

@Directive({
	selector: "[tooltip]",
	standalone: true,
})
class TooltipDirective implements AfterViewInit, OnDestroy {
	@Input("tooltip") tooltipBase!: HTMLElement;
	viewContainerRef = inject(ViewContainerRef);
	templToRender = inject(TemplateRef<any>);

	portalService = inject(PortalService);

	ngAfterViewInit() {
		this.tooltipBase.addEventListener("mouseenter", () => {
			this.showTooltip();
		});
		this.tooltipBase.addEventListener("mouseleave", () => {
			this.hideTooltip();
		});
	}

	el: HTMLElement | null = null;

	showTooltip = () => {
		const { left, bottom } = this.tooltipBase.getBoundingClientRect();

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

	ngOnDestroy() {
		this.hideTooltip();
	}
}

@Component({
	selector: "app-root",
	standalone: true,
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

bootstrapApplication(AppComponent);
