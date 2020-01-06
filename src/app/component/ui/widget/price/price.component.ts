import { Component, OnInit } from '@angular/core';
import { PriceService } from 'src/app/provider/price/price.service';
import { EventEmitter } from 'events';
import { SYMBOL } from 'src/_client/enums/symbols';
import { IPrice } from 'src/_client/interfaces/price';
import * as numeral from 'numeral';


@Component({
	selector: 'app-coin-price',
	templateUrl: './price.component.html',
	styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {
	private _emitter: EventEmitter;
	public price:IPrice;

	constructor(
		private _PriceService: PriceService
	) {

	}

	ngOnInit() {
		this.startListening();
	}

	async fetchCurrentPrice(){
		try{
			let result:IPrice = await this._PriceService.getCurrentPrice(SYMBOL.XBT);
			this.price = result;	
		}catch(e){
			console.log("Error getting current price...",e);
		}
	}

	async startListening() {
		try{
			await this.fetchCurrentPrice();
		}catch(e){
			console.log(e);
		}
		this._emitter = this._PriceService.listenPrice(SYMBOL.XBT);
		this._emitter.on(SYMBOL.XBT, (newPrice: IPrice)=> {
			this.price = newPrice;
		});
	}

	formatDollars(ammount: number){
		return numeral(ammount).format("0,0.00")+" USD";
	}

}
