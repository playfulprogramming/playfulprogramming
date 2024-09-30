import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { Injectable, Component, inject, OnInit } from "@angular/core";

@Injectable({ providedIn: "root" })
class MessageValue {
	greeting = "";

	changeGreeting(val: string) {
		this.greeting = val;
	}
}

@Component({
	selector: "great-grand-child",
	standalone: true,
	template: `
		<div>
			<p>{{ messageValue.greeting }}, user!</p>
			<label>
				<div>Set a new greeting</div>
				<input [value]="messageValue.greeting" (input)="changeVal($event)" />
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
	greeting = "✨ Welcome 💯";

	// New ✨ sparkly ✨ functionality adds some fun! 💯
	changeGreeting(newVal: string) {
		if (!newVal.includes("✨")) {
			newVal += "✨";
		}
		if (!newVal.includes("💯")) {
			newVal += "💯";
		}
		this.greeting = newVal;
	}
}

@Component({
	selector: "grand-child",
	standalone: true,
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
	standalone: true,
	imports: [GrandChildComponent],
	template: `<grand-child />`,
})
class ChildComponent {}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [ChildComponent],
	template: `<child-comp />`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
