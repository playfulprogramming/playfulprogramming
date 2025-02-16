import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { AppComponent } from "./app/app.component";
import { provideExperimentalZonelessChangeDetection } from "@angular/core";
import { provideFileRouter } from "@analogjs/router";

bootstrapApplication(AppComponent, {
	providers: [
		provideExperimentalZonelessChangeDetection(),
		provideFileRouter(),
	],
});
