import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	ElementRef,
	inject,
	Injectable,
	Input,
	OnDestroy,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
	ViewEncapsulation,
} from "@angular/core";
import { DomPortalOutlet, TemplatePortal } from "@angular/cdk/portal";

@Injectable({
	providedIn: "root",
})
class PortalService {
	outlet = new DomPortalOutlet(document.querySelector("body")!);
}

@Component({
	selector: "app-tooltip",
	standalone: true,
	template: `
		<div>
			<div #targetRef (mouseenter)="showTooltip()" (mouseleave)="hideTooltip()">
				<ng-content></ng-content>
			</div>
			<ng-template #portalContent>
				<div
					class="tooltip"
					:style="'left: ' + left + 'px; top: ' + top + 'px'"
				>
					{{ text }}
				</div>
			</ng-template>
		</div>
	`,
})
class TooltipComponent implements OnDestroy {
	@ViewChild("targetRef") targetRef!: ElementRef<HTMLElement>;
	@ViewChild("portalContent") portalContent!: TemplateRef<unknown>;
	viewContainerRef = inject(ViewContainerRef);
	portalService = inject(PortalService);

	left = 0;
	top = 0;

	@Input() text = "";

	showTooltip() {
		const { left, bottom } =
			this.targetRef.nativeElement.getBoundingClientRect();
		this.left = left;
		this.top = bottom;
		setTimeout(() => {
			this.portalService.outlet.attach(
				new TemplatePortal(this.portalContent, this.viewContainerRef),
			);
		});
	}

	hideTooltip() {
		if (this.portalService.outlet.hasAttached()) {
			this.portalService.outlet.detach();
		}
	}

	ngOnDestroy() {
		this.hideTooltip();
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [TooltipComponent],
	template: `
		<div>
			<app-tooltip text="This is a tooltip">
				<button>Hover me</button>
			</app-tooltip>
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
