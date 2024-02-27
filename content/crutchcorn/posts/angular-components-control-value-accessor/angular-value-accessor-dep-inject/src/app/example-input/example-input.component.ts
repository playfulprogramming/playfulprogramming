import {
	Component,
	Input,
	ChangeDetectorRef,
	Optional,
	Self,
	OnInit,
} from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";

function coerceBooleanProperty(value: any): boolean {
	return value != null && `${value}` !== "false";
}

@Component({
	selector: "app-example-input",
	templateUrl: "./example-input.component.html",
	styleUrls: ["./example-input.component.css"],
})
export class ExampleInputComponent implements OnInit, ControlValueAccessor {
	constructor(
		@Optional() @Self() public ngControl: NgControl,
		private _changeDetector: ChangeDetectorRef,
	) {
		if (ngControl != null) {
			// Setting the value accessor directly (instead of using
			// the providers) to avoid running into a circular import.
			ngControl.valueAccessor = this;
		}
	}

	@Input() placeholder: string;

	private _value: any = "";
	private _disabled: boolean = false;

	/** The method to be called in order to update ngModel */
	_controlValueAccessorChangeFn: (value: any) => void = () => {};

	/**
	 * onTouch function registered via registerOnTouch (ControlValueAccessor).
	 */
	onTouched: () => any = () => {};

	get isSecretValue() {
		return /unicorns/.exec(this._value);
	}

	ngOnInit() {
		const control = this.ngControl && this.ngControl.control;
		if (control) {
			console.log("ngOnInit", control);
			// FormControl should be available here
		}
	}

	get errors() {
		const control = this.ngControl && this.ngControl.control;
		if (control) {
			return control.touched && control.errors;
		}
		return null;
	}

	/**
	 * Getters and setters for internal values
	 */

	@Input()
	get value(): any {
		return this._value;
	}
	set value(newValue: any) {
		if (this._value !== newValue) {
			// Set this before proceeding to ensure no circular loop occurs with selection.
			this._value = newValue;
		}
	}

	@Input()
	get disabled(): boolean {
		return this._disabled;
	}
	set disabled(value) {
		this._disabled = coerceBooleanProperty(value);
	}

	onChange(event: any) {
		this._controlValueAccessorChangeFn(event.target.value);
	}

	/**
	 * Methods from the ControlValueAccessor
	 */
	writeValue(value: any) {
		this.value = value;
		this._changeDetector.markForCheck();
	}

	registerOnChange(fn: (value: any) => void) {
		this._controlValueAccessorChangeFn = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouched = fn;
	}

	// Optional
	setDisabledState(isDisabled: boolean) {
		this.disabled = isDisabled;
		this._changeDetector.markForCheck();
	}
}
