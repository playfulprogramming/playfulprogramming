import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "doubleNum", standalone: true })
class DoubleNumPipe implements PipeTransform {
	transform(value: number): number {
		return value * 2;
	}
}

@Component({
	selector: "count-and-double",
	standalone: true,
	imports: [DoubleNumPipe],
	template: `
		<div>
			<p>{{ number }}</p>
			<p>{{ number | doubleNum }}</p>
			<button (click)="addOne()">Add one</button>
		</div>
	`,
})
class CountAndDoubleComponent {
	number = 0;

	addOne() {
		this.number++;
	}
}

bootstrapApplication(CountAndDoubleComponent);
