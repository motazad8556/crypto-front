import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'src/app/provider/order/order.service';
import { IPositionHistory } from 'src/_client/interfaces/positionHistory';
import { QUERY_ORDER_DIR } from 'src/_client/enums/query';
import { CN_POSITION_HISTORY } from 'src/_client/enums/columnNames';
import { FormatService } from 'src/app/provider/format/format.service';
import * as moment from 'moment';

declare const $:any;

@Component({
	selector: 'app-order-history-widget',
	templateUrl: './order-history.component.html',
	styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
	@Input("showSearch") showSearch:boolean;

	private _positionHistory: IPositionHistory[];
	private _listening:boolean = false;
	public searchCount:number = 0;
	private _skip = 0;
	private _limit = 5;

	public get positionHistory() {
		return this._positionHistory;
	}

	constructor(
		private _formatService: FormatService,
		private _OrderService: OrderService) { }

	ngOnInit() {
		this.loadHistory();
		this.listenHistory();
	}

	async listenHistory() {
		if(this._listening){
			return;
		}
		this._listening = true;
		this._OrderService.listenNewPositionHistoryAdded((order)=>{
			this.loadHistory();
		});
	}

	async loadHistory() {
		console.log({
			'this._skip': this._skip,
			'this._limit': this._limit
		});
		let orders = await this._OrderService.fetchPositionHistory({
			order: QUERY_ORDER_DIR.DESC,
			orderBy: CN_POSITION_HISTORY.createdAt,
			skip: this._skip,
			freeQuery: document.getElementById('freeSearchInput') && document.getElementById('freeSearchInput')['value'] ? document.getElementById('freeSearchInput')['value'] : null,
			limit: this._limit
		});
		this._positionHistory = orders.records;
		this.searchCount = orders.count;
	}

	async freeSearchOrder(event?:any){
		if(event){
			event.preventDefault();
		}
		if(document.getElementById('freeSearchInput')['value']){
			await this.loadHistory();
		}
	}

	getDate = this._formatService.formatDisplayDate;

	async showInfoModal(){
		$("#freeQueryHelpDialog").modal('show');
	}

	getPages(){
		return Math.floor(this.searchCount / this._limit);
	}

	getCurrentPage(){
		return Math.floor(this._skip / this._limit);
	}

	filterDate(which:number){
		let _queryPortion = 'MPH_.date_time';
		let _m = moment();
		switch(which){
			case 1:	//This Month
			_m.date(1)
			break;
			case 2:	//This Year
			_m
				.month(0)
				.date(1);
			break;
			case 3:	//Today
			break;
		}
		_m.hour(0)
		.minute(0)
		.second(0)
		.millisecond(0);
		_queryPortion+=" >= '"+_m.format('MM/DD/YYYY HH:mm:ss')+"'";
		document.getElementById('freeSearchInput')['value'] = _queryPortion;
	}

	goBack(){
		if(this._skip>0){
			this._skip-=this._limit;
		}
		this.loadHistory();
	}

	goForth(){
		if(this._positionHistory.length==this._limit){
			this._skip+=this._limit;
		}
		this.loadHistory();
	}

	toDecimalsOnly(ammount:number){
		return ammount.toFixed(8);
	}

}
