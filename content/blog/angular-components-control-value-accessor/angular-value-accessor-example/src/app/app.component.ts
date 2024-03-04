import { Component, VERSION } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  control = new FormControl('');
  modelValue = "";
}
