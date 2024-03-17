import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-root",
	standalone: true,
	template: ` <p>Hello, world!</p> `,
})
class AppComponent implements OnInit {
	// Will not prevent `Hello, world!` from showing
	ngOnInit() {
		throw new Error("Error in constructor");
	}
}

bootstrapApplication(AppComponent);
