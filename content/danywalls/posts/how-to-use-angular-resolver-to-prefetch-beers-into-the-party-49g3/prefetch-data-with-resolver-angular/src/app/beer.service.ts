import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Beer } from './models/beer';

@Injectable()
export class BeerService {
  public beers$!: Observable<Beer[]>;
  constructor(private http: HttpClient) {
    this.getBeers();
  }
  private getBeers(): void {
    this.beers$ = this.http
      .get<Beer[]>('https://api.punkapi.com/v2/beers')
      .pipe(delay(1000));
  }
}
