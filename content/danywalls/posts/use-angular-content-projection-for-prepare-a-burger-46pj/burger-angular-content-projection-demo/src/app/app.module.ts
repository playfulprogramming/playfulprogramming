import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BurgerComponent } from './burger.component';
import { BottomBunComponent } from './components/bottombun.component';
import { CheeseComponent } from './components/cheese.component';
import { MeatComponent } from './components/meat.component';
import { OnionComponent } from './components/onion.component';
import { TomatoComponent } from './components/tomato.component';
import { TopBunComponent } from './components/topbun.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [
    AppComponent,
    BurgerComponent,
    BottomBunComponent,
    CheeseComponent,
    MeatComponent,
    OnionComponent,
    TomatoComponent,
    TopBunComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
