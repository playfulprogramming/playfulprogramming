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
	// Explain why we need to pass in document
	// @see https://github.com/angular/components/blob/fdd16e667550690d554bba49888bfc6929bc97b2/src/cdk/portal/dom-portal-outlet.ts#L43-L47
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

		// TODO: Explain this
		this.el = viewRef.rootNodes[0] as HTMLElement;

		this.el.classList.add("tooltip");
		this.el.style.left = `${left}px`;
		this.el.style.top = `${bottom}px`;

		setTimeout(() => {
			this.portalService.outlet.attach(
				// TODO: Explain why you'd use DomPortal rather than TemplatePortal
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
