import { Component, Input } from "@angular/core";

@Component({
	selector: "app-example-input",
	template: `
		<label class="inputContainer">
			<span class="inputLabel">{{ placeholder }}</span>
			<input placeholder="" class="inputInput" [(ngModel)]="value" />
		</label>
		<p
			class="hiddenMessage"
			[class.hideTheMessage]="!isSecretValue"
			aria-hidden="true"
		>
			You unlocked the secret unicorn rave!<span>🦄🦄🦄</span>
		</p>
		<p aria-live="assertive" class="visually-hidden">
			{{
				isSecretValue
					? "You discovered the secret unicorn rave! They're all having a party now that you summoned them by typing their name"
					: ""
			}}
		</p>
	`,
	styleUrls: ["./example-input.component.css"],
})
export class ExampleInputComponent {
	@Input() placeholder: string;
	value: any = "";

	get isSecretValue() {
		return /unicorns/.exec(this.value.toLowerCase());
	}
}
