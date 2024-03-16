import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

@Component({
	selector: "my-app",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent {
	control = new FormControl("", Validators.required);
}
