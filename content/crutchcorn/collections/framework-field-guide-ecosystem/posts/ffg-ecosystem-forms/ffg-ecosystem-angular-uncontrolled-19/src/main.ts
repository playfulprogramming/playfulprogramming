import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	provideZonelessChangeDetection,
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
				<input #agreeCheckbox (input)="onAgreeChange()" type="checkbox" />
			</label>
			<div style="margin-top: 1em;">
				<button type="submit">Submit</button>
			</div>
		</form>
	`,
})
export class App {
	agreeCheckbox = viewChild("agreeCheckbox", {read: ElementRef<HTMLInputElement>});

	onAgreeChange() {
		this.agreeCheckbox()?.nativeElement.setCustomValidity("");
	}

	submit(event: Event) {
		event.preventDefault();
		const checkbox = this.agreeCheckbox()?.nativeElement;
		if (!checkbox) return;
		if (!checkbox.checked) {
			checkbox.setCustomValidity("You must agree to the terms.");
			checkbox.reportValidity();
		} else {
			checkbox.setCustomValidity("");
			alert("You have successfully signed up for our service, whatever that is");
		}
	}
}

void bootstrapApplication(App, {
	providers: [provideZonelessChangeDetection()],
});
