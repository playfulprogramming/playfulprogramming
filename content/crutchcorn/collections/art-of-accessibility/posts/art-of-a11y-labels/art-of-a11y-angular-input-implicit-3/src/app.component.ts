import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TextInputComponent } from "./TextInput.component";

// app.component.ts
@Component({
	selector: "app-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TextInputComponent],
	template: `
		<form>
			<text-input label="Email"></text-input>
			<text-input label="Password" type="password"></text-input>
			<button type="submit">Login</button>
		</form>
	`,
})
export class AppComponent {}
