import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Pipe, PipeTransform } from "@angular/core";
import { JsonPipe } from "@angular/common";

@Pipe({ name: "getListProps", pure: false })
class GetListPropsPipe implements PipeTransform {
	transform<T extends object, K extends keyof T>(value: T[], key: K): T[K][] {
		return value.map((item) => item[key]);
	}
}

@Component({
	selector: "app-root",
	imports: [GetListPropsPipe, JsonPipe],
	template: `
		<div>
			<p>{{ list | getListProps: "age" | json }}</p>
			<button (click)="addTenToAges()">Change ages</button>
		</div>
	`,
})
class AppComponent {
	list = [
		{
			name: "John",
			age: 30,
		},
		{
			name: "Jane",
			age: 25,
		},
	];

	addTenToAges() {
		this.list.forEach((item) => {
			item.age = item.age + 10;
		});
	}
}

bootstrapApplication(AppComponent);
