import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BeerService } from '../../beer.service';
import { Beer } from '../../models/beer';

@Component({
  selector: 'app-beer-room',
  templateUrl: './beer-room.component.html',
})
export class BeerRoomComponent {
  public beers$: Observable<Beer[]>;
  constructor(private beerService: BeerService) {
    this.beers$ = beerService.beers$;
  }
}
