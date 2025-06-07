import { Component, ChangeDetectionStrategy, input } from "@angular/core";

// TextInput.component.ts
@Component({
	selector: "text-input",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<label>
			{{ label() }}
			<input [type]="type()" />
		</label>
	`,
})
export class TextInputComponent {
	label = input.required<string>();
	type = input<string>();
}
