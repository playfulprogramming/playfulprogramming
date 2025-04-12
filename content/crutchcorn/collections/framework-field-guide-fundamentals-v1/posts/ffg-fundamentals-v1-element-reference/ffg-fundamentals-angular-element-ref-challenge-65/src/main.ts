import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { NgIf } from "@angular/common";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [NgIf],
	template: `
		<div style="padding: 10rem">
			<div
				*ngIf="tooltipMeta.show"
				[style]="
					'
        display: flex;
        overflow: visible;
        justify-content: center;
        width: ' +
					tooltipMeta.width +
					'px;
        position: fixed;
        top: ' +
					(tooltipMeta.y - tooltipMeta.height - 16 - 6 - 8) +
					'px;
        left: ' +
					tooltipMeta.x +
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
class AppComponent implements OnDestroy {
	@ViewChild("buttonRef") buttonRef!: ElementRef<HTMLElement>;

	tooltipMeta = {
		x: 0,
		y: 0,
		height: 0,
		width: 0,
		show: false,
	};

	mouseOverTimeout: any = null;

	onMouseOver() {
		this.mouseOverTimeout = setTimeout(() => {
			const bounding = this.buttonRef.nativeElement.getBoundingClientRect();
			this.tooltipMeta = {
				x: bounding.x,
				y: bounding.y,
				height: bounding.height,
				width: bounding.width,
				show: true,
			};
		}, 1000);
	}

	onMouseLeave() {
		this.tooltipMeta = {
			x: 0,
			y: 0,
			height: 0,
			width: 0,
			show: false,
		};
		clearTimeout(this.mouseOverTimeout);
	}

	ngOnDestroy() {
		clearTimeout(this.mouseOverTimeout);
	}
}

bootstrapApplication(AppComponent);
