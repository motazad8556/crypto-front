import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { ORDERBOOK_CODE } from 'src/_client/enums/codes';
import { PriceService } from '../price/price.service';
import { SYMBOL } from 'src/_client/enums/symbols';
import { IPrice } from 'src/_client/interfaces/price';
import ConnectionManager from 'src/_client/manager/ConnectionManager';
import { IRealtimeBitmexOrderData } from 'src/_client/interfaces/priceRequest';

@Injectable({
	providedIn: 'root'
})
export class OrderbookService {

	private static _emitter:EventEmitter;
	private _price:IPrice;
	public readonly  URL:string = "wss://www.bitmex.com/realtime?subscribe=orderBook10:XBTUSD";
	private _listenerSocket: WebSocket;

	public get listenerSocket(){
		return this._listenerSocket;
	};

	public get price(){
		return this._price;
	}

	public get emitter():EventEmitter{
		return OrderbookService._emitter;
	}

	constructor(
		private _PriceService: PriceService
	) {
	}

	unlisten(){
		this._listenerSocket.close();
	}


	private _listenToOrderBook(callback: Function){
		this._listenerSocket = ConnectionManager.listenStream(this.URL, function(data:any){
			if(data && Object.keys(JSON.parse(data)).indexOf("table")>-1){
				let object = <IRealtimeBitmexOrderData>JSON.parse(data);
				object.data = object.data.map((value)=>{
					value['timestamp'] = new Date(value['timestamp']);
					return value;
				});
				callback(object);
			}
		});
	}

	public async listenToOrderBook(){
		if(!this.emitter){
			OrderbookService._emitter = new EventEmitter();
			this._listenToOrderBook((data:IRealtimeBitmexOrderData)=>{
				this.emitter.emit(ORDERBOOK_CODE.UPDATED, {
					data:data
				});
			});
		}
		return this.emitter;
	}

}
