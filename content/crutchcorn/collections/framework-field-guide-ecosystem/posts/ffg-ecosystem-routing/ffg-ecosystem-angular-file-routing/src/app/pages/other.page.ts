import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-other",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<h1>Other</h1>
		<a href="/">Home</a>
	`,
})
export default class OtherComponent {}
