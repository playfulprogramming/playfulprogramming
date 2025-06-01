import { Component, ChangeDetectionStrategy, input } from "@angular/core";
import { v4 as uuidv4 } from "uuid";

// TextInput.component.ts
@Component({
	selector: "text-input",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<label [for]="id()" class="label">
			{{ label() }}
		</label>
		<input
			[id]="id()"
			[type]="type()"
			[attr.aria-invalid]="!!error()"
			[attr.aria-errormessage]="id() + '-error'"
		/>
		<p class="errormessage" [id]="id() + '-error'">{{ error() }}</p>
	`,
	styles: [
		`
			.label {
				margin-right: 1rem;
			}
			.errormessage {
				color: red;
			}
		`,
	],
})
export class TextInputComponent {
	label = input.required<string>();
	id = input(uuidv4());
	type = input<string>();
	error = input<string>();
}
