import { Component, OnInit } from '@angular/core';
import { OrderbookService } from 'src/app/provider/orderbook/orderbook.service';
import { ORDERBOOK_CODE } from 'src/_client/enums/codes';
import { EventEmitter } from 'events';
import { IUIOrderData, IUIDisplayOrderData } from 'src/_client/interfaces/price';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'app-orderbook',
	templateUrl: './orderbook.component.html',
	styleUrls: ['./orderbook.component.scss']
})
export class OrderbookComponent implements OnInit {

	private _emitter: EventEmitter;
	public orderData:IUIDisplayOrderData;
	private _bidsOrderDataHTML: string;
	private _asksOrderDataHTML: string;

	public asksOrderDataHTML:SafeHtml;
	public bidsOrderDataHTML:SafeHtml;

	constructor(
		private _OrderbookService: OrderbookService,
		private _domSanitizer: DomSanitizer
	) { }

	ngOnInit() {
		this.startListening();
	}

	async startListening() {
		this._emitter = await this._OrderbookService.listenToOrderBook();
		let dataEvents = 0;
		this._emitter.on(ORDERBOOK_CODE.UPDATED, (data: IUIOrderData) => {
			dataEvents++;
			this.setOrderbookData(data);
			const debug = false;
			if (dataEvents > 10 && debug) {
				this._emitter.removeAllListeners();
				this._OrderbookService.unlisten();
			}
		});
	}

	setOrderbookData(payload: IUIOrderData) {
		this.orderData = this.getDisplayOrderData(payload);

		let bidsOrderDataHTML = [];
		this.orderData.data.asks.forEach((element)=>{
			bidsOrderDataHTML.push("<tr>")
			bidsOrderDataHTML.push(`<td>${element.price}</td>`)
			bidsOrderDataHTML.push(`<td>${element.size}</td>`)
			bidsOrderDataHTML.push("</tr>")
		});
		this._bidsOrderDataHTML = bidsOrderDataHTML.join("\n");
		this.bidsOrderDataHTML = this._domSanitizer.bypassSecurityTrustHtml(this._bidsOrderDataHTML);

		let askOrderDataHTML = [];
		this.orderData.data.asks.forEach((element)=>{
			askOrderDataHTML.push("<tr>")
			askOrderDataHTML.push(`<td>${element.price}</td>`)
			askOrderDataHTML.push(`<td>${element.size}</td>`)
			askOrderDataHTML.push("</tr>")
		});
		this._asksOrderDataHTML = askOrderDataHTML.join("\n");
		this.asksOrderDataHTML =  this._domSanitizer.bypassSecurityTrustHtml(this._asksOrderDataHTML);
	}

	getDisplayOrderData(payload:IUIOrderData):IUIDisplayOrderData{
		let data:IUIDisplayOrderData = {
			origin: payload,
			data: {
				asks: payload.data.data[0].asks.map((element, index)=>{
					return {
						price: element[0]+(5*index),
						size: element[1]/2	//NOTE: CLARIFY THIS
					}
				}).sort((element, elementB)=>{
					let sortA = 1, sortB = -1;
					return element.price > elementB.price ? sortA : (element.price == elementB.price ? 0 : sortB);
				}),
				bids: payload.data.data[0].bids.map((element, index)=>{
					return {
						price: element[0]-(5*index),
						size: element[1]/2	//NOTE: CLARIFY THIS
					}
				}).sort((element, elementB)=>{
					let sortA = -1, sortB = 1;
					return element.price > elementB.price ? sortA : (element.price == elementB.price ? 0 : sortB);
				})
			}
		};
		return data;
	}

}
