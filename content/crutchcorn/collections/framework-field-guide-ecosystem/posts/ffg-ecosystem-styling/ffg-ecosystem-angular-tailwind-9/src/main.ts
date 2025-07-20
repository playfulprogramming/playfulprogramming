import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	provideZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
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

void bootstrapApplication(App, {
	providers: [provideZonelessChangeDetection()],
});
