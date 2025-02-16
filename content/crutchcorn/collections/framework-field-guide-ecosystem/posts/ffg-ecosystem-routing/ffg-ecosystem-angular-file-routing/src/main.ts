import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { AppComponent } from "./app/app.component";
import { provideZoneChangeDetection } from "@angular/core";
import { provideFileRouter } from "@analogjs/router";

bootstrapApplication(AppComponent, {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideFileRouter(),
	],
});
