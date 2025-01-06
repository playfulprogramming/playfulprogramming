import { bootstrapApplication } from "@angular/platform-browser";
import {
	Component,
	ChangeDetectionStrategy,
	linkedSignal,
	provideExperimentalZonelessChangeDetection,
	signal,
} from "@angular/core";

@Component({
	selector: "count-and-double",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<p>{{ number() }}</p>
			<button (click)="addOne()">Add one</button>
			<p>{{ doubleNum() }}</p>
			<button (click)="addOneToDouble()">Add one</button>
		</div>
	`,
})
class CountAndDoubleComponent {
	number = signal(0);
	doubleNum = linkedSignal(() => this.number() * 2);

	addOne() {
		this.number.set(this.number() + 1);
	}

	addOneToDouble() {
		this.doubleNum.set(this.doubleNum() + 1);
	}
}

bootstrapApplication(CountAndDoubleComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
