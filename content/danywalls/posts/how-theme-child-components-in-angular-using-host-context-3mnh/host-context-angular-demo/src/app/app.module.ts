import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { ButtonComponent } from './button/button.component';
import { ProductComponent } from './product/product.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [
    AppComponent,
    HelloComponent,
    ButtonComponent,
    ProductComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
