import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	provideZonelessChangeDetection,
	signal,
} from "@angular/core";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form (submit)="submit($event)">
			<p>Pretend that there is some legalese here.</p>
			<label>
				<span>Agree to the terms?</span>
				<input (input)="onAgreeChange($event)" type="checkbox" />
			</label>
			@if(showError()) {
				<p style="color: red;">You must agree to the terms.</p>
			}
			<div style="margin-top: 1em;">
				<button type="submit">Submit</button>
			</div>
		</form>
	`,
})
export class App {
	checked = signal(false);
	showError = signal(false);

	onAgreeChange(event: Event) {
		const checkbox = event.target as HTMLInputElement;
		this.checked.set(checkbox.checked);
		this.showError.set(false);
	}

	submit(event: Event) {
		event.preventDefault();
		if (!this.checked()) {
			this.showError.set(true);
		} else {
			this.showError.set(false);
			alert("You have successfully signed up for our service, whatever that is");
		}
	}
}

void bootstrapApplication(App, {
	providers: [provideZonelessChangeDetection()],
});
