import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ExampleInputComponent } from './example-input/example-input.component';

@NgModule({
  imports:      [ ReactiveFormsModule, FormsModule, BrowserModule ],
  declarations: [ AppComponent, ExampleInputComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
