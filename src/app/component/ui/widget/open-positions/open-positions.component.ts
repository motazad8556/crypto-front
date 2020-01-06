import { Component, OnInit } from '@angular/core';
import { QUERY_ORDER_DIR } from 'src/_client/enums/query';
import { OrderService } from 'src/app/provider/order/order.service';
import { IOpenPosition } from 'src/_client/interfaces/openPosition';
import { CN_OPEN_POSITION, CN_OPEN_POSITION_INCLUDE_REL } from 'src/_client/enums/columnNames';
import { SYMBOL } from 'src/_client/enums/symbols';
import { PriceService } from 'src/app/provider/price/price.service';
import { IPrice } from 'src/_client/interfaces/price';
import { TextService } from 'src/app/provider/message/text.service';
import { MessageService } from 'src/app/provider/message/message.service';
import { SUCCESS_UI, RESULT_CODE } from 'src/_client/enums/codes';
import { FormatService } from 'src/app/provider/format/format.service';
import { LoadingService } from 'src/app/provider/loading/loading.service';

@Component({
	selector: 'app-open-positions',
	templateUrl: './open-positions.component.html',
	styleUrls: ['./open-positions.component.scss']
})
export class OpenPositionsComponent implements OnInit {

	private _openPositions: IOpenPosition[];
	private _skip = 0;
	private _limit = 5;
	public loading = false;

	public set openPositions(newPositions:IOpenPosition[]){
		this._openPositions = newPositions;
	}

	public get openPositions(){
		return this._openPositions;
	}


	constructor(
		private _PriceService: PriceService,
		private _LoadingService: LoadingService,
		private _textService: TextService,
		private _messageService: MessageService,
		private _formatService: FormatService,
		private _OrderService: OrderService) {
	}

	ngOnInit() {
		this.loadOpenPositions();
		this.listenOrders();
		this.listenBitcoinPrice();
	}

	async loadOpenPositions() {
		this.loading = true;
		try {
			let result = await this._OrderService.fetchOpenPositions({
				order: QUERY_ORDER_DIR.DESC,
				orderBy: CN_OPEN_POSITION.createdAt,
				skip: this._skip,
				limit: this._limit,
				includedRel:[CN_OPEN_POSITION_INCLUDE_REL.price_copy]
			});
			this.openPositions = result;
		} catch (e) {
			console.log(e);
			//throw e;
		}
		this.loading = false;
	}

	private _listening = false;
	async listenOrders() {
		if(this._listening){
			return;
		}
		this._listening = true;
		this._OrderService.listenNewOpenPositions((newOpenPosition)=>{
			this.loadOpenPositions();
		});
		this._OrderService.listenOpenPositionRemoved((removedOpenPosition)=>{
			if(this._openPositions && this._openPositions.find((element)=>{
				return (removedOpenPosition.id === element.id)
			})){
				this.loadOpenPositions();
			}
		});
		this._OrderService.listenOpenPositionClosedAMP((removedOpenPosition)=>{
			if(this._openPositions && this._openPositions.find((element)=>{
				return (removedOpenPosition.id === element.id)
			})){
				this.loadOpenPositions();
			}
		});
	}

	private _currentPrice: number = null;
	private _listeningToPrice: boolean = false;
	listenBitcoinPrice(){
		if(this._listeningToPrice) return;
		this._listeningToPrice = true;

		this._PriceService.listenPrice(SYMBOL.XBT)
		.addListener(SYMBOL.XBT, (newPrice:IPrice)=>{
			this._currentPrice = newPrice.price;
		});
	}

	getProfit(order:IOpenPosition):string{
		if(!this._currentPrice) return "-L-";
		return this._PriceService.getProfit( this._currentPrice, order.entry_price, order.size, this._currentPrice, order.leverage, order.side)+"";
	}

	async closeAMP(order: IOpenPosition) {
		this._OrderService.closeOpenPositionAMP(order.id)
		.then((data)=>{
			let res = this._textService.getSucessMessage(SUCCESS_UI.CLOSED_OO_AMP);
			this._messageService.showMessageBox(res.title, res.message);
		})
		.catch((err)=>{
			let res = this._textService.getErrorMessage(RESULT_CODE.INTERNAL_ERROR);
			this._messageService.showMessageBox(res.title, res.message);
		})
	}

	public getDate = this._formatService.formatDisplayDate;

	async saveExitPrice(position: IOpenPosition){
		this._LoadingService.show();
		let result = await this._OrderService.saveOpenPositionExitPrice(position.id, position.exit_price);
		this._LoadingService.hide();
	}

	async saveStopPrice(position: IOpenPosition){
		this._LoadingService.show();
		let result = await this._OrderService.saveOpenPositionStopPrice(position.id, position.stop_price);
		this._LoadingService.hide();
	}

	isRed(order:IOpenPosition){
		return parseFloat(this.getProfit(order)) < 0;
	}

	goBack(){
		if(this._skip>0){
			this._skip-=this._limit;
			this.loadOpenPositions();
		}
	}

	goForth(){
		if(this._openPositions && this._openPositions.length==this._limit){
			this._skip+=this._limit;
			this.loadOpenPositions();
		}
	}

}
