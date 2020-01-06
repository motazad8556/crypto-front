import { Injectable } from '@angular/core';
import Initializer from 'src/_client/_init';
import ConnectionManager from 'src/_client/manager/ConnectionManager';
import { DatabaseService } from '../database/database.service';
import { OrderService } from '../order/order.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(
	private _DatabaseService: DatabaseService
  ) { }

  async init(){
	//Initialize base API
	await Initializer.init();
	await this._DatabaseService.init();
	if(!ConnectionManager.IOClientSocket.connected){
		throw "SOCKET CONNECTION NOT MADE...";
	}
  }
}
