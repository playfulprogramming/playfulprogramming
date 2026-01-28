import { Component, HostBinding, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  theme = '';
  @HostBinding('class.dark') appTheme: boolean = false;
  changeTheme() {
    this.theme = this.theme == '' ? 'day' : 'dark';
  }

  addDarkTheme() {
    this.appTheme = true;
  }

  reset() {
    this.theme = '';
    this.appTheme = false;
  }
}
