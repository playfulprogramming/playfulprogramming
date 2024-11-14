import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Pipe, PipeTransform, signal } from "@angular/core";

@Pipe({ name: "doubleNum" })
class DoubleNumPipe implements PipeTransform {
	transform(value: number): number {
		return value * 2;
	}
}

@Component({
	selector: "app-root",
	imports: [DoubleNumPipe],
	template: `
		<div>
			<p>{{ number() }}</p>
			<p>{{ number() | doubleNum }}</p>
			<button (click)="addOne()">Add one</button>
		</div>
	`,
})
class AppComponent {
	number = signal(0);

	addOne() {
		this.number.set(this.number() + 1);
	}
}

bootstrapApplication(AppComponent);
