import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ORDER_TYPE, ORDER_SIDE } from 'src/_client/enums/order';
import { OrderService } from 'src/app/provider/order/order.service';
import { PAIR, SYMBOL } from 'src/_client/enums/symbols';
import { TextService } from 'src/app/provider/message/text.service';
import { MessageService } from 'src/app/provider/message/message.service';
import { UI_RESULT_CODE, RESULT_CODE, SUCCESS_UI } from 'src/_client/enums/codes';
import { LoadingService } from 'src/app/provider/loading/loading.service';
import { IOpenOrderCreateRequestPayload } from 'src/_client/interfaces/openOrder';
import Utils from 'src/_client/utils';
import { PriceService } from 'src/app/provider/price/price.service';
import { IPrice } from 'src/_client/interfaces/price';

@Component({
	selector: 'app-buy-sell',
	templateUrl: './buy-sell.component.html',
	styleUrls: ['./buy-sell.component.scss']
})
export class BuySellComponent implements OnInit {

	public buyForm: FormGroup;
	public ORDER_TYPE = ORDER_TYPE;
	public ORDER_SIDE = ORDER_SIDE;
	public price:IPrice;

	constructor(
		private _formBuilder: FormBuilder,
		private _orderService: OrderService,
		private _LoadingService: LoadingService,
		private _MessageService: MessageService,
		private _PriceService: PriceService,
		private _TextService: TextService) {

	}

	ngOnInit() {
		this.setUpForm();
		this.setUpPrices();
	}

	async setUpPrices(){
		this.price = await this._PriceService.getCurrentPrice(SYMBOL.XBT);
		this._PriceService.listenPrice(SYMBOL.XBT)
		.addListener(SYMBOL.XBT, (newPrice:IPrice)=>{
			this.price = newPrice;
			this.setRequiredAmmount();
			this.setDefaultLimitPrice();
		});
	}

	hasValidLimitPrice(control:AbstractControl){
		if( !!control.parent)
		{
			if(
				((control.parent.controls['orderType'].value == ORDER_TYPE.LIMIT) && control.value < 1 )
			){
				return {
					invalidValue: true
				}
			}
		}
		return null;
	}

	setUpForm(){
		this.buyForm = this._formBuilder.group({
			orderType: [ORDER_TYPE.LIMIT, [Validators.required]],
			quantity: [100, [Validators.min(100), Validators.max(1e6)]],
			stop_price: [null, [Validators.min(1), Validators.max(1e6)]],
			exit_price: [null, [Validators.min(1), Validators.max(1e6)]],
			orderSide: [ORDER_SIDE.SHORT, [(control:FormControl)=>{
				if(!control){
					return null;
				}
				return (control.value === ORDER_SIDE.SHORT || control.value === ORDER_SIDE.LONG) ? null : {invalidSide: true};
			}]],
			limitPrice: [100, [(control:FormControl)=>{
				let res = this.hasValidLimitPrice(control);
				return res;
			}]],
			makerOnly: [true],
			leverage: [0, [Validators.required]],
			newBtcPrice: [100, [Validators.min(0.50)]]
		});
		this.buyForm.valueChanges.subscribe(() => {
			this.setRequiredAmmount();
		});
	}

	async placeOrder(){
		this.buyForm.controls['limitPrice'].updateValueAndValidity();
		if(this.buyForm.valid){
			let value = this.buyForm.value;
			let creationPayload:IOpenOrderCreateRequestPayload = {
				order_type: 		value['orderType'],
				pair:				PAIR.BTC_USD,
				side:				value['orderSide'],
				size:				value['quantity'],
				limit_price:		value['limitPrice'],
				entry_price:		0,
				leverage:			value['leverage'],
				maker_only:			value['orderType'] === ORDER_TYPE.MARKET_ORDER ? false : value['makerOnly'],
				stop_price:			value['stop_price'],
				exit_price:			value['exit_price'],
				datetime: 			null,
			};
			this._LoadingService.show();
			let result = await this._orderService.addNewOrder(creationPayload);
			let title:string, message:string;
			
			if(result._meta._statusCode !== RESULT_CODE.SUCCESS){
				let payload = this._TextService.getErrorMessage(result._meta._statusCode);
				title = payload.title;
				message = payload.message;
			}else{
				let payload = this._TextService.getSucessMessage(SUCCESS_UI.ADDED_OPEN_ORDER);
				title = payload.title;
				message = payload.message;
			}
			this._LoadingService.hide();
			this._MessageService.showMessageBox(title, message);
		}else{
			let {title, message} = this._TextService.getErrorMessage_ui(UI_RESULT_CODE.INVALID_DATA);
			this._MessageService.showMessageBox(title, message);
		}

	}

	requiredAmmount: number;

	setRequiredAmmount(){
		if(this.price && this.buyForm){
			this.requiredAmmount = Utils.normalizeBitcoinAmmount(Utils.getMargin(this.buyForm.value['quantity'], this.price.price, this.buyForm.value['leverage']));
		}else{
			this.requiredAmmount = -1;
		}
	}


	updateMarketOrder(){
		//orderType
		if(this.buyForm.controls['orderType'].value == ORDER_TYPE.MARKET_ORDER){
			this.buyForm.controls['makerOnly'].disable();
		}else{
			this.buyForm.controls['makerOnly'].enable();
		}
	}

	setDefaultLimitPrice(){
		if(!this.buyForm.controls['limitPrice'].dirty){
			this.buyForm.controls['limitPrice'].setValue(this.price.price);
		}
	}

	async setNewBtcPrice(){
		const control = this.buyForm.controls['newBtcPrice'];
		if(control.valid){
			//Set the new bitcoin price
			console.log("Setting up...");
			let res = await this._PriceService.setPrice(parseFloat(control.value));
			console.log(`Result from setting-up the price: `,res);
		}
	}

}
