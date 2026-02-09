import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeerRoomComponent } from './pages/beer-room/beer-room.component';

import { HomeComponent } from './pages/home.component';
import { ResolverRoomComponent } from './pages/resolver-room/resolver-room.component';
import { BeerResolverService } from './resolvers/beer.resolver.service';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'beer-room',
    component: BeerRoomComponent,
  },
  {
    path: 'resolver-room',
    component: ResolverRoomComponent,
    resolve: { beers: BeerResolverService },
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
