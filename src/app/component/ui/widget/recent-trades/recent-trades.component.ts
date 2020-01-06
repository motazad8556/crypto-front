import { Component, OnInit } from '@angular/core';
import { RecentTradesService } from 'src/app/provider/recent-trades/recent-trades.service';
import { EventEmitter } from 'selenium-webdriver';
import { RECENT_TRADES_CODE } from 'src/_client/enums/codes';
import { ILatestPriceRequestBody_bitmex_parsed } from 'src/_client/interfaces/priceRequest';
import * as moment from 'moment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'app-recent-trades',
	templateUrl: './recent-trades.component.html',
	styleUrls: ['./recent-trades.component.scss']
})
export class RecentTradesComponent implements OnInit {
	private _emitter: EventEmitter;
	public recentTrades: ILatestPriceRequestBody_bitmex_parsed[];
	private _recentTradesHTML:string;
	public recentTradesHTML:SafeHtml;

	constructor(
		private _recentTradesService: RecentTradesService,
		private _domSanitizer:DomSanitizer
	) { }

	ngOnInit() {
		this.startListening();
	}

	async startListening() {
		this._emitter = await this._recentTradesService.litenToRecentTrades();
		let dataEvents = 0;
		this._emitter.on(RECENT_TRADES_CODE.UPDATED, (data: ILatestPriceRequestBody_bitmex_parsed[]) => {
			dataEvents++;
			this.setRecentTradesData(data);
			const debug = false;
			if (dataEvents > 10 && debug) {
				this._recentTradesService.unlisten();
			}
		});
	}

	setRecentTradesData(data:ILatestPriceRequestBody_bitmex_parsed[]){
		this.recentTrades = data;
		let html = [];
		for(let i=data.length-1;i>0;i--){
			html.push(`<tr style=" ${this.isMinus(data[i]) ? `
				background-color: rgb(237, 185, 171);
			` : `
				background-color: rgb(181, 222, 192);
			`}">`);
			html.push(`<td
			style="padding: .1rem;"
			>${Math.round(data[i].price)}</td>`);
			html.push(`<td
			style="padding: .1rem;"
			>${data[i].size < 100 ? 100 : data[i].size}</td>`);
			html.push(`<td
			style="padding: .1rem;"
			>${moment(data[i].timestamp).format('HH:mm:ss:SSS')}</td>`);
			html.push(`<td
			style="padding: .1rem;"
			>${this.isSale(data[i]) ? 'S' : 'B'}</td>`);
			html.push("</tr>");
		}
		this._recentTradesHTML = html.join("\n");
		this.recentTradesHTML = this._domSanitizer.bypassSecurityTrustHtml(this._recentTradesHTML);
	}

	isMinus(data:ILatestPriceRequestBody_bitmex_parsed){
		return (/minus/ig).test(data.tickDirection);
	}

	isSale(data:ILatestPriceRequestBody_bitmex_parsed){
		return (/sell/ig).test(data.side);
	}

}
