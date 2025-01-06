import { bootstrapApplication } from "@angular/platform-browser";
import {
	afterRenderEffect,
	provideExperimentalZonelessChangeDetection,
	signal,
} from "@angular/core";

import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<input
				type="number"
				[value]="num()"
				(input)="num.set($any($event.target).valueAsNumber)"
			/>
			<div style="display: flex; justify-content: flex-end">
				<h1 id="number" style="display: inline-block">
					{{ num() }}
				</h1>
			</div>
			<h1
				style="position: absolute; left: {{ bounding().left }}px; top: {{
					bounding().top + bounding().height
				}}px"
			>
				^
			</h1>
		</div>
	`,
})
class App {
	num = signal(10);

	bounding = signal({
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		height: 0,
	});

	constructor() {
		afterRenderEffect(() => {
			const _rerunWhenThisIsUpdated = this.num();
			// This should be using a `viewChild`. More on that in a future chapter
			const el = document.querySelector("#number");
			const b = el?.getBoundingClientRect();
			if (!b) return;
			this.bounding.set(b);
		});
	}
}

bootstrapApplication(App, {
	providers: [provideExperimentalZonelessChangeDetection()],
}).catch((err) => console.error(err));
