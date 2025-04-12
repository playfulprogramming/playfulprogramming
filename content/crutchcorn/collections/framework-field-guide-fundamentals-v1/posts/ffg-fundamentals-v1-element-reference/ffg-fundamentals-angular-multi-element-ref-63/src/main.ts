import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, ViewChildren, QueryList, ElementRef } from "@angular/core";
import { NgFor } from "@angular/common";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [NgFor],
	template: `
		<div>
			<button (click)="scrollToTop()">Scroll to top</button>
			<ul style="height: 100px; overflow: scroll">
				<li #listItem *ngFor="let message of messages">
					{{ message }}
				</li>
			</ul>
			<button (click)="scrollToBottom()">Scroll to bottom</button>
		</div>
	`,
})
class AppComponent {
	@ViewChildren("listItem") els!: QueryList<ElementRef<HTMLElement>>;

	scrollToTop() {
		this.els.get(0)!.nativeElement.scrollIntoView();
	}

	scrollToBottom() {
		this.els.get(this.els.length - 1)!.nativeElement.scrollIntoView();
	}

	messages = [
		"The new slides for the design keynote look wonderful!",
		"Some great new colours are planned to debut with Material Next!",
		"Hey everyone! Please take a look at the resources I’ve attached.",
		"So on Friday we were thinking about going through that park you’ve recommended.",
		"We will discuss our upcoming Pixel 6 strategy in the following week.",
		"On Thursday we drew some great new ideas for our talk.",
		"So the design teams got together and decided everything should be made of sand.",
	];
}

bootstrapApplication(AppComponent);
