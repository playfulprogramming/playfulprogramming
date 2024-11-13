import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ElementRef,
	Injectable,
	TemplateRef,
	ViewContainerRef,
	inject,
	viewChild,
	signal,
	effect,
} from "@angular/core";

import { DomPortalOutlet, TemplatePortal } from "@angular/cdk/portal";

@Injectable({
	providedIn: "root",
})
class PortalService {
	outlet = new DomPortalOutlet(document.querySelector("body")!);
}

@Component({
	selector: "app-root",
	template: `
		<div
			style="
				height: 100px;
				width: 100%;
				background: lightgrey;
				position: relative;
				z-index: 2;
			"
		></div>
		<div
			style="z-index: 1; position: relative; padding-left: 10rem; padding-top: 2rem"
		>
			<ng-template #portalContent>
				<div
					[style]="
						'
				z-index: 9;
        display: flex;
        overflow: visible;
        justify-content: center;
        width: ' +
						tooltipMeta().width +
						'px;
        position: fixed;
        top: ' +
						(tooltipMeta().y - tooltipMeta().height - 16 - 6 - 8) +
						'px;
        left: ' +
						tooltipMeta().x +
						'px;
      '
					"
				>
					<div
						style="
          white-space: nowrap;
          padding: 8px;
          background: #40627b;
          color: white;
          border-radius: 16px;
        "
					>
						This will send an email to the recipients
					</div>
					<div
						style="
          height: 12px;
          width: 12px;
          transform: rotate(45deg) translateX(-50%);
          background: #40627b;
          bottom: calc(-6px - 4px);
          position: absolute;
          left: 50%;
          zIndex: -1;
        "
					></div>
				</div>
			</ng-template>

			<button
				#buttonRef
				(mouseover)="onMouseOver()"
				(mouseleave)="onMouseLeave()"
			>
				Send
			</button>
		</div>
	`,
})
class AppComponent {
	buttonRef = viewChild.required("buttonRef", {
		read: ElementRef<HTMLElement>,
	});

	portalContent = viewChild.required("portalContent", { read: TemplateRef });

	viewContainerRef = inject(ViewContainerRef);
	portalService = inject(PortalService);

	tooltipMeta = signal({
		x: 0,
		y: 0,
		height: 0,
		width: 0,
	});

	mouseOverTimeout: any = null;

	constructor() {
		effect((onCleanup) => {
			onCleanup(() => {
				clearTimeout(this.mouseOverTimeout);
			});
		});
	}

	onMouseOver() {
		this.mouseOverTimeout = setTimeout(() => {
			const bounding = this.buttonRef().nativeElement.getBoundingClientRect();
			this.tooltipMeta.set({
				x: bounding.x,
				y: bounding.y,
				height: bounding.height,
				width: bounding.width,
			});
			this.portalService.outlet.attach(
				new TemplatePortal(this.portalContent(), this.viewContainerRef),
			);
		}, 1000);
	}

	onMouseLeave() {
		this.tooltipMeta.set({
			x: 0,
			y: 0,
			height: 0,
			width: 0,
		});
		if (this.portalService.outlet.hasAttached()) {
			this.portalService.outlet.detach();
		}
		clearTimeout(this.mouseOverTimeout);
	}
}

bootstrapApplication(AppComponent);
