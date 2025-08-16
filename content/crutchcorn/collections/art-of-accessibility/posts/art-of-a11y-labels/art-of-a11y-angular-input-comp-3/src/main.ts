import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
	input,
} from "@angular/core";
import { v4 as uuidv4 } from "uuid";

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

@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TextInputComponent],
	template: `
		<form>
			<text-input label="Email" id="email" error="Invalid email"></text-input>
			<text-input label="Password" type="password"></text-input>
			<button type="submit">Login</button>
		</form>
	`,
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
