import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, signal } from "@angular/core";

@Component({
	selector: "title-changer",
	template: `
		<div>
			<button (click)="updateTitle('Movies')">Movies</button>
			<button (click)="updateTitle('Music')">Music</button>
			<button (click)="updateTitle('Documents')">Documents</button>
			<p>{{ title }}</p>
		</div>
	`,
})
class TitleChangerComponent {
	title = signal("Movies");

	updateTitle(val: string) {
		setTimeout(() => {
			this.title.set(val);
			document.title = val;
		}, 5000);
	}
}

@Component({
	selector: "app-root",
	imports: [TitleChangerComponent],
	template: `
		<div>
			<button (click)="toggle()">Toggle title changer</button>
			@if (show()) {
				<title-changer />
			}
		</div>
	`,
})
class AppComponent {
	show = signal(true);

	toggle() {
		this.show.set(!this.show());
	}
}

bootstrapApplication(AppComponent);
