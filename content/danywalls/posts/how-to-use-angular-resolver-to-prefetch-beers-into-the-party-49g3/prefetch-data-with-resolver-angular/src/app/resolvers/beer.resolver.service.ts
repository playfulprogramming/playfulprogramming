import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { BeerService } from '../beer.service';
import { Beer } from '../models/beer';

@Injectable()
export class BeerResolverService implements Resolve<Observable<Beer[]>> {
  constructor(private beerService: BeerService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Beer[]> {
    return this.beerService.beers$;
  }
}
