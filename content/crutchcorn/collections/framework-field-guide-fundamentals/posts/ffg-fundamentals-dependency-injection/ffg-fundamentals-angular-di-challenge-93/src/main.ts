import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app.component";

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
