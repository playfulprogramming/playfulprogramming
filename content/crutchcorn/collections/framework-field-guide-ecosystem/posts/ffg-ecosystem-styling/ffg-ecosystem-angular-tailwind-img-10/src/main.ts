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
		<img
			class="rounded-full border-sky-200 border-[12px]"
			src="/assets/unicorn.png"
			alt="A cartoon unicorn in a bowtie with a light blue rounded border"
		/>
	`,
})
export class App {}

void bootstrapApplication(App, {
	providers: [provideZonelessChangeDetection()],
});
