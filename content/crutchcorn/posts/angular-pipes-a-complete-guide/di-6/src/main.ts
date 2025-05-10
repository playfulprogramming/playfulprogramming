import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	inject,
	Injectable,
	Pipe,
	PipeTransform,
} from "@angular/core";

@Injectable({ providedIn: "root" })
class UserService {
	name = "Corbin Crutchley";
}

@Pipe({ name: "greeting" })
class GreetingPipe implements PipeTransform {
	userService = inject(UserService);

	transform(greeting: string) {
		return `${greeting}, ${this.userService.name}`;
	}
}

@Component({
	selector: "app-root",
	imports: [GreetingPipe],
	template: `
		<div>
			<p>{{ "Hello" | greeting }}</p>
		</div>
	`,
})
class AppComponent {}

bootstrapApplication(AppComponent);
