import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { Component } from "@angular/core";

@Component({
	selector: "app-root",
	standalone: true,
	template: `
		<a
			class="bg-indigo-600 text-white py-2 px-4 rounded-md"
			href="https://discord.gg/FMcvc6T"
		>
			Join our Discord
		</a>
	`,
})
export class App {}

void bootstrapApplication(App);
