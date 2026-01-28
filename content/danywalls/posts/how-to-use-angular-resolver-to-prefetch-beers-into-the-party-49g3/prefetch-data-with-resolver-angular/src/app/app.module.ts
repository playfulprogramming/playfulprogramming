import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BeerService } from './beer.service';
import { BeerRoomComponent } from './pages/beer-room/beer-room.component';
import { HomeComponent } from './pages/home.component';
import { ResolverRoomComponent } from './pages/resolver-room/resolver-room.component';
import { BeerResolverService } from './resolvers/beer.resolver.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BeerRoomComponent,
    ResolverRoomComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, BrowserAnimationsModule],
  providers: [BeerService, BeerResolverService],
  bootstrap: [AppComponent],
})
export class AppModule {}
