import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Beer } from '../../models/beer';

@Component({
  templateUrl: './resolver-room.component.html',
})
export class ResolverRoomComponent implements OnInit {
  beerRouterList!: Beer[];
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.beerRouterList = this.route.snapshot.data['beers'];
  }
}
