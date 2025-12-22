import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { provideRouter, RouterOutlet, Routes } from "@angular/router";

@Component({
	selector: "app-other",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<h1>Other</h1>
		<a href="/">Home</a>
	`,
})
export class Other {}

@Component({
	selector: "app-home",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<h1>Home</h1>
		<a href="/other">Other</a>
	`,
})
export class Home {}

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterOutlet],
	template: `<router-outlet></router-outlet>`,
})
export class App {}

const routes: Routes = [
	{
		path: "",
		component: App,
		children: [
			{
				path: "",
				component: Home,
			},
			{
				path: "other",
				component: Other,
			},
		],
	},
];

void bootstrapApplication(App, {
	providers: [
		provideExperimentalZonelessChangeDetection(),
		provideRouter(routes),
	],
});
