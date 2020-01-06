import { Component, OnInit } from '@angular/core';
import { RouteService } from 'src/app/provider/route/route.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(
	public routeService: RouteService
  ) { }

  ngOnInit() {
  }

}
