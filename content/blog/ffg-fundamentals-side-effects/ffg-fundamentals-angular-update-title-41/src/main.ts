import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";
import { NgIf } from "@angular/common";

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
class TitleChangerComponent {
	title = "Movies";

	updateTitle(val: string) {
		setTimeout(() => {
			this.title = val;
			document.title = val;
		}, 5000);
	}
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [NgIf, TitleChangerComponent],
	template: `
		<div>
			<button (click)="toggle()">Toggle title changer</button>
			<title-changer *ngIf="show" />
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
