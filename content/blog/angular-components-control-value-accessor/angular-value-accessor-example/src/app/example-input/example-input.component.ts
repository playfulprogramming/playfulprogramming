import { Component, forwardRef, Input, ChangeDetectorRef } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

function coerceBooleanProperty(value: any): boolean {
  return value != null && `${value}` !== 'false';
}

/**
 * Provider Expression that allows your component  to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 */
export const EXAMPLE_CONTROL_VALUE_ACCESSOR: any = {  
  /**
   * Used to provide a `ControlValueAccessor` for form controls.
   */
  provide: NG_VALUE_ACCESSOR,
  /**
   * Allows to refer to references which are not yet defined.
   * This is because it's needed to `providers` in the component but references
   * the component itself. Handles circular dependency issues
   */
  useExisting: forwardRef(() => ExampleInputComponent),
  multi: true
};

@Component({
  selector: 'app-example-input',
  templateUrl: './example-input.component.html',
  styleUrls: ['./example-input.component.css'],
  providers: [EXAMPLE_CONTROL_VALUE_ACCESSOR]
})
export class ExampleInputComponent implements ControlValueAccessor {
  @Input() placeholder: string;

  private _value: any = "";
  private _disabled: boolean = false;

  /** The method to be called in order to update ngModel */
  _controlValueAccessorChangeFn: (value: any) => void = () => {};

  /**
   * onTouch function registered via registerOnTouch (ControlValueAccessor).
   */
  onTouched: () => any = () => {};

  constructor(private _changeDetector: ChangeDetectorRef) { }

  get isSecretValue() {
    return /unicorns/.exec(this._value);
  }

  /**
   * Getters and setters for internal values
   */

  @Input()
  get value(): any { return this._value; }
  set value(newValue: any) {
    if (this._value !== newValue) {
      // Set this before proceeding to ensure no circular loop occurs with selection.
      this._value = newValue;
    }
  }

  @Input()
  get disabled(): boolean { return this._disabled; }
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