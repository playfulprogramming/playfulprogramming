import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import { Component, computed, signal } from "@angular/core";

@Component({
	selector: "count-and-double",
	template: `
		<div>
			<p>{{ number() }}</p>
			<p>{{ doubleNum() }}</p>
			<button (click)="addOne()">Add one</button>
		</div>
	`,
})
class CountAndDoubleComponent {
	number = signal(0);
	doubleNum = computed(() => this.number() * 2);

	addOne() {
		this.number.set(this.number() + 1);
	}
}

bootstrapApplication(CountAndDoubleComponent);
