import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnInit, EventEmitter, Output } from "@angular/core";

/**
 * This code sample is inaccessible and generally not
 * production-grade. It's missing:
 * - Focus on menu open
 * - Closing upon external click
 *
 * Read on to learn how to add these
 */
@Component({
	selector: "app-root",
	standalone: true,
	imports: [],
	template: `
		<div style="margin-top: 5rem; margin-left: 5rem">
			<div (contextmenu)="open($event)">Right click on me!</div>
		</div>
		@if (isOpen) {
			<div
				[style]="
					'
      position: fixed;
      top: ' +
					mouseBounds.y +
					'px;
      left: ' +
					mouseBounds.x +
					'px;
      background: white;
      border: 1px solid black;
      border-radius: 16px;
      padding: 1rem;
    '
				"
			>
				<button (click)="close()">X</button>
				This is a context menu
			</div>
		}
	`,
})
class AppComponent {
	isOpen = false;

	mouseBounds = {
		x: 0,
		y: 0,
	};

	close() {
		this.isOpen = false;
	}

	open(e: MouseEvent) {
		e.preventDefault();
		this.isOpen = true;
		this.mouseBounds = {
			// Mouse position on click
			x: e.clientX,
			y: e.clientY,
		};
	}
}

bootstrapApplication(AppComponent);
