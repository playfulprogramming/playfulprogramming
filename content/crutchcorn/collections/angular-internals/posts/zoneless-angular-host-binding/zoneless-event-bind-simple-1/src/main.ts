import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<button (click)="add()">{{ count }}</button>`,
})
export class AppComponent {
	count = 0;

	add() {
		this.count++;
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
