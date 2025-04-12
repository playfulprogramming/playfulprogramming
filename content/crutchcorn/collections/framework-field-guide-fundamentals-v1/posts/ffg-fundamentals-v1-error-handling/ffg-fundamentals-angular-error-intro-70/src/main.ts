import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component } from "@angular/core";
import { NgFor } from "@angular/common";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [NgFor],
	template: `
		<h1>To-do items</h1>
		<ul>
			<li *ngFor="let item of priorityItems">{{ item.name }}</li>
		</ul>
	`,
})
class AppComponent {
	items = [
		{ id: 1, name: "Take out the trash", priority: 1 },
		{ id: 2, name: "Cook dinner", priority: 1 },
		{ id: 3, name: "Play video games", priority: 2 },
	];

	priorityItems = this.items.filter((item: any) => item.item.priority === 1);
}

bootstrapApplication(AppComponent);
