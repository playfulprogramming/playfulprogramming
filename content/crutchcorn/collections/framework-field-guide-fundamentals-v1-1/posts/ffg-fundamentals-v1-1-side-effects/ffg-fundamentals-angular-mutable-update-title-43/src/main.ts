import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, NgZone, OnDestroy, inject } from "@angular/core";

@Component({
	selector: "title-changer",
	standalone: true,
	template: `
		<div>
			<button (click)="updateTitle('Movies')">Movies</button>
			<button (click)="updateTitle('Music')">Music</button>
			<button (click)="updateTitle('Documents')">Documents</button>
			<p>{{ title }}</p>
		</div>
	`,
})
class TitleChangerComponent implements OnDestroy {
	title = "Movies";

	timeoutExpire: any = null;

	// This is using "Dependency Injection" (chapter 11)
	// To access Angular's internals and expose them to you
	ngZone = inject(NgZone);

	updateTitle(val: string) {
		clearTimeout(this.timeoutExpire);
		// Do not run this in runOutsideAngular, otherwise `title` will never update
		const expire = setTimeout(() => {
			this.title = val;
			document.title = val;
		}, 5000);

		this.ngZone.runOutsideAngular(() => {
			this.timeoutExpire = expire;
		});
	}

	ngOnDestroy() {
		clearTimeout(this.timeoutExpire);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [TitleChangerComponent],
	template: `
		<div>
			<button (click)="toggle()">Toggle title changer</button>
			@if (show) {
				<title-changer />
			}
		</div>
	`,
})
class AppComponent {
	show = true;

	toggle() {
		this.show = !this.show;
	}
}

bootstrapApplication(AppComponent);
