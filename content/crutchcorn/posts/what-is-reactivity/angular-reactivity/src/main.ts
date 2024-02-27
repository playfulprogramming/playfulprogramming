import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";
import { NgFor } from "@angular/common";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [NgFor],
	template: `
		<button (click)="count = count + 1">Add one to: {{ count }}</button>
		<button (click)="count = count - 1">Remove one from: {{ count }}</button>
		<ul id="list">
			<li *ngFor="let item of [].constructor(count); let i = index">
				List item {{ i }}
			</li>
		</ul>
	`,
})
class AppComponent {
	count = 0;
}

bootstrapApplication(AppComponent);
