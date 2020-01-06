import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { IPrice } from 'src/_client/interfaces/price';
import { PriceService } from '../price/price.service';
import ConnectionManager from 'src/_client/manager/ConnectionManager';
import { RECENT_TRADES_CODE } from 'src/_client/enums/codes';
import { ILatestPriceRequestBody_bitmex_parsed, ILatestTradesData_bitmex } from 'src/_client/interfaces/priceRequest';

@Injectable({
  providedIn: 'root'
})
export class RecentTradesService {

	private static _emitter:EventEmitter;
	private _price:IPrice;
	public readonly  URL:string = "wss://www.bitmex.com/realtime?subscribe=trade:XBTUSD";
	private _listenerSocket: WebSocket;
	private _latestPrices:ILatestPriceRequestBody_bitmex_parsed[] = [];
	private _maxAmmountOfRecords = 50;

	public get listenerSocket(){
		return this._listenerSocket;
	};

	public get price(){
		return this._price;
	}

	public get emitter():EventEmitter{
		return RecentTradesService._emitter;
	}

	constructor(
		private _PriceService: PriceService
	) {
	}

	unlisten(){
		this._listenerSocket.close();
	}

	addRecord(object:ILatestTradesData_bitmex){
		this._latestPrices = this._latestPrices.concat(object.data);
		if(this._latestPrices.length > this._maxAmmountOfRecords){
			let dif = this._latestPrices.length - this._maxAmmountOfRecords;
			this._latestPrices = this._latestPrices.filter((record, index)=>{
				return (index+1) > dif;
			});
		}
	}


	private _litenToRecentTrades(callback: Function){
		this._listenerSocket = ConnectionManager.listenStream(this.URL, (data:any)=>{
			if(data && Object.keys(JSON.parse(data)).indexOf("table")>-1){
				let object = <ILatestTradesData_bitmex>JSON.parse(data);
				object.data = object.data.map((value)=>{
					value['timestamp'] = new Date(value['timestamp']);
					return value;
				});
				this.addRecord(object);
				callback(this._latestPrices);
			}
		});
	}

	public async litenToRecentTrades(){
		if(!this.emitter){
			RecentTradesService._emitter = new EventEmitter();
			this._litenToRecentTrades((data:ILatestPriceRequestBody_bitmex_parsed[])=>{
				RecentTradesService._emitter.emit(RECENT_TRADES_CODE.UPDATED, data);
			});
		}
		return this.emitter;
	}
}


/*
private async _listenPrices(symbol:SYMBOL){
	let current = await this._PriceService.getCurrentPrice(symbol);
	if(current){
		this._price = current;
	}else{
		this._PriceService.listenPrice(symbol).on(symbol, (newPrice:IPrice)=>{
			this._price = newPrice;
		});
		await new Promise((accept)=>{
			this._PriceService.listenPrice(symbol).on(symbol, function(){
				accept();
			});
		});
	}
}*/