import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	provideZonelessChangeDetection,
	signal,
	viewChild,
} from "@angular/core";

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form (submit)="submit($event)">
			<p>Pretend that there is some legalese here.</p>
			<label>
				<span>Agree to the terms?</span>
				<input #agreeCheckbox (input)="onAgreeChange($event)" type="checkbox" />
			</label>
			@if (showError()) {
				<div>
					<p style="color: red;">You must agree to the terms.</p>
					<button type="button" (click)="onAgreeClick()">Agree</button>
				</div>
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

	agreeCheckbox = viewChild("agreeCheckbox", {
		read: ElementRef<HTMLInputElement>,
	});

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
			alert(
				"You have successfully signed up for our service, whatever that is",
			);
		}
	}

	onAgreeClick() {
		const el = this.agreeCheckbox()?.nativeElement;
		if (!el) return;
		el.checked = true;
		const event = new Event("input");
		el.dispatchEvent(event);
	}
}

void bootstrapApplication(App, {
	providers: [provideZonelessChangeDetection()],
});
