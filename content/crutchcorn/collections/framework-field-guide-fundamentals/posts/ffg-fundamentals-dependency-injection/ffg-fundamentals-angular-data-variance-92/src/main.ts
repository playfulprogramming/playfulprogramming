import { bootstrapApplication } from "@angular/platform-browser";
import {
	Injectable,
	Component,
	inject,
	signal,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Injectable({ providedIn: "root" })
class MessageValue {
	greeting = signal("");

	changeGreeting(val: string) {
		this.greeting.set(val);
	}
}

@Component({
	selector: "great-grand-child",
	template: `
		<div>
			<p>{{ messageValue.greeting() }}, user!</p>
			<label>
				<div>Set a new greeting</div>
				<input [value]="messageValue.greeting()" (input)="changeVal($event)" />
			</label>
		</div>
	`,
})
class GreatGrandChildComponent {
	messageValue = inject(MessageValue);

	changeVal(e: any) {
		this.messageValue.changeGreeting(e.target.value);
	}
}

@Injectable({ providedIn: "root" })
class SparklyMessageValue {
	greeting = signal("✨ Welcome 💯");

	// New ✨ sparkly ✨ functionality adds some fun! 💯
	changeGreeting(newVal: string) {
		if (!newVal.includes("✨")) {
			newVal += "✨";
		}
		if (!newVal.includes("💯")) {
			newVal += "💯";
		}
		this.greeting.set(newVal);
	}
}

@Component({
	selector: "grand-child",
	providers: [
		{
			provide: MessageValue,
			// Overwrite the previous injected class with a new implementation
			useClass: SparklyMessageValue,
		},
	],
	imports: [GreatGrandChildComponent],
	template: `<great-grand-child />`,
})
class GrandChildComponent {}

@Component({
	selector: "child-comp",
	imports: [GrandChildComponent],
	template: `<grand-child />`,
})
class ChildComponent {}

@Component({
	selector: "app-root",
	imports: [ChildComponent],
	template: `<child-comp />`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
