import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { Component } from "@angular/core";

// This is buggy code that ESLint will catch with Angular plugins configured
@Component({
	selector: "app-root",
	standalone: true,
	template: "<p>Hello, world!</p>",
})
export class AppThing {}

void bootstrapApplication(AppThing);
