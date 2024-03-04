import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Directive, inject, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Directive({
	selector: "[listenForEvents]",
	standalone: true,
})
class ListenForEventDirective implements OnInit {
	count = 0;

	doc = inject(DOCUMENT);

	ngOnInit() {
		this.doc.addEventListener("hello", () => {
			alert(`You sent this many events: ${++this.count}`);
		});
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ListenForEventDirective],
	template: `
		<p listenForEvents>This paragraph tag listens for events!</p>
		<button (click)="sendEvent()">Send event</button>
	`,
})
class AppComponent {
	sendEvent() {
		const event = new CustomEvent("hello");
		document.dispatchEvent(event);
	}
}

bootstrapApplication(AppComponent);
