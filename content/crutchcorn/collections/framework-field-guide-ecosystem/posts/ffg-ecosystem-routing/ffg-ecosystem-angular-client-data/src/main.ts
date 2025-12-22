import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import {
	ActivatedRoute,
	provideRouter,
	RouterOutlet,
	Routes,
} from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
	selector: "app-other",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<h1>Other</h1>
		<a href="/">Home</a>
		<pre>
			<code>
{{ routeDataJson() }}
			</code>
		</pre>
	`,
})
export class Other {
	activatedRoute = inject(ActivatedRoute);
	routeData = toSignal(this.activatedRoute.data);
	routeDataJson = computed(() => JSON.stringify(this.routeData(), null, 2));
}

@Component({
	selector: "app-home",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<h1>Home</h1>
		<a href="/other">Other</a>
		<pre>
			<code>
{{ routeDataJson() }}
			</code>
		</pre>
	`,
})
export class Home {
	activatedRoute = inject(ActivatedRoute);
	routeData = toSignal(this.activatedRoute.data);
	routeDataJson = computed(() => JSON.stringify(this.routeData(), null, 2));
}

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
		// Data returned from the parent is not inherently passed to the children
		children: [
			{
				path: "",
				component: Home,
				resolve: {
					pageNum: () => {
						return 1;
					},
				},
			},
			{
				path: "other",
				component: Other,
				resolve: {
					pageNum: async () => {
						// Simulate an async data fetch
						await new Promise((resolve) => setTimeout(resolve, 100));
						return 789;
					},
				},
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
