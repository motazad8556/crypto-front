import { Component, OnInit } from '@angular/core';
import { IOpenOrder } from 'src/_client/interfaces/openOrder';
import { OrderService } from 'src/app/provider/order/order.service';
import { QUERY_ORDER_DIR } from 'src/_client/enums/query';
import { CN_OPEN_ORDER } from 'src/_client/enums/columnNames';
import { OPEN_ORDER_STATUS } from 'src/_client/enums/order';
import { PriceService } from 'src/app/provider/price/price.service';
import { SYMBOL } from 'src/_client/enums/symbols';
import { IPrice } from 'src/_client/interfaces/price';
import { TextService } from 'src/app/provider/message/text.service';
import { MessageService } from 'src/app/provider/message/message.service';
import { SUCCESS_UI, RESULT_CODE } from 'src/_client/enums/codes';
import { LoadingService } from 'src/app/provider/loading/loading.service';

@Component({
	selector: 'app-open-orders',
	templateUrl: './open-orders.component.html',
	styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit {

	private _openOrder: IOpenOrder[];
	private _currentPrice:number = null;
	private _skip = 0;
	private _limit = 10;
	public loading = false;

	public set openOrders(newPositions:IOpenOrder[]){
		console.log("Setting up new orders: ",newPositions);
		this._openOrder = newPositions;
	}

	public get openOrders(){
		return this._openOrder;
	}

	constructor(
		private _PriceService: PriceService,
		private _textService: TextService,
		private _LoadingService: LoadingService,
		private _messageService: MessageService,
		private _OrderService: OrderService) {
		this.listenOrders();
	}

	ngOnInit() {
		this.loadOpenOrders();
	}

	async loadOpenOrders() {
		this.loading = true;
		try {
			let result = await this._OrderService.fetchOpenOrders({
				order: QUERY_ORDER_DIR.DESC,
				orderBy: CN_OPEN_ORDER.createdAt,
				skip: this._skip,
				limit: this._limit,
				exact:{
					status: OPEN_ORDER_STATUS.ACTIVE
				}
			});
			this.openOrders = result;
		} catch (e) {
			console.log(e);
			//throw e;
		}
		this.loading = false;
	}

	private _listening = false;
	listenOrders() {
		if(this._listening){
			return;
		}
		this._listening = true;
		
		this._OrderService.listenNewOpenOrder((order) => {
			this.loadOpenOrders();
		});
		this._OrderService.listenOpenOrderRemoved((order) => {
			if(this.openOrders && this.openOrders.find((loadedOrder)=>{
				return loadedOrder.id === order.id
			})){
				this.loadOpenOrders();
			}
		});
		this._OrderService.listenOpenOrderCancelled((order) => {
			if(this.openOrders && this.openOrders.find((loadedOrder)=>{
				return loadedOrder.id === order.id
			})){
				this.loadOpenOrders();
			}
		});
		this._OrderService.listenOpenOrderRemoved((order) => {
			if(this.openOrders && this.openOrders.find((loadedOrder)=>{
				return loadedOrder.id === order.id
			})){
				this.loadOpenOrders();
			}
		});
		this._OrderService.listenOpenOrderUpgraded((order) => {
			if(this.openOrders && this.openOrders.find((loadedOrder)=>{
				return loadedOrder.id === order.id
			})){
				this.loadOpenOrders();
			}
		});
	}

	private _listeningToPrice: boolean = false;
	listenBitcoinPrice(){
		if(this._listeningToPrice) return;
		this._listeningToPrice = true;

		this._PriceService.listenPrice(SYMBOL.XBT)
		.addListener(SYMBOL.XBT, (newPrice:IPrice)=>{
			this._currentPrice = newPrice.price;
		});
	}

	getProfit(order:IOpenOrder):string{
		if(this._currentPrice) return "-L-";
		return this._PriceService.getProfit( this._currentPrice, order.entry_price, order.size, order.price_copy.price, order.leverage, order.side)+"";
	}

	async cancelOrder(order: IOpenOrder) {
		this._OrderService.cancelOpenOrder(order.id)
		.then((data)=>{
			let res = this._textService.getSucessMessage(SUCCESS_UI.CANCELLED_OPEN_ODER);
			this._messageService.showMessageBox(res.title, res.message);
		})
		.catch((err)=>{
			let res = this._textService.getErrorMessage(RESULT_CODE.INTERNAL_ERROR);
			this._messageService.showMessageBox(res.title, res.message);
		})
	}

	async saveStopPrice(order: IOpenOrder){
		this._LoadingService.show();
		let result = await this._OrderService.saveOpenOrderStopPrice(order.id, order.stop_price);
		this._LoadingService.hide();
	}

	async saveExitPrice(order: IOpenOrder){
		this._LoadingService.show();
		let result = await this._OrderService.saveOpenOrderExitPrice(order.id, order.exit_price);
		this._LoadingService.hide();
	}


	goBack(){
		if(this._skip>0){
			this._skip-=this._limit;
			this.loadOpenOrders();
		}
	}

	goForth(){
		if(this._openOrder && this._openOrder.length==this._limit){
			this._skip+=this._limit;
			this.loadOpenOrders();
		}
	}

}
