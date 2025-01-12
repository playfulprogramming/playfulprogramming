import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { Component } from "@angular/core";

@Component({
	selector: "app-root",
	standalone: true,
	template: `
		<img
			class="rounded-full border-sky-200 border-[12px]"
			src="/assets/unicorn.png"
			alt="A cartoon unicorn in a bowtie with a light blue rounded border"
		/>
	`,
})
export class App {}

void bootstrapApplication(App);
