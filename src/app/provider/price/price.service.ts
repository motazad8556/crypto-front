import { Injectable } from '@angular/core';
import PriceController from 'src/_client/controller/price';
import { SYMBOL } from 'src/_client/enums/symbols';
import { IPrice } from 'src/_client/interfaces/price';
import { AuthService } from '../auth/auth.service';
import { ORDER_SIDE } from 'src/_client/enums/order';
import { Utils } from 'src/_client/utils';

@Injectable({
	providedIn: 'root'
})
export class PriceService {

	constructor(
		private _authService: AuthService
	) { }

	listenPrice(symbol: SYMBOL) {
		return PriceController.listenToPrice(symbol);
	}

	async getCurrentPrice(symbol:SYMBOL){
		let price:IPrice = null;
		try{
			price = await PriceController.getCurrentPrice(symbol, (await this._authService.getToken()).jwt);
		}catch(e){
			if((e+"").indexOf("'Va' of null")>-1){
				console.log("Retrying...");
				await new Promise((accept)=>{
					setTimeout(()=>{
						accept();
					}, 300);
				});
				return this.getCurrentPrice(symbol);
			}else{
				console.log(e);
			}
		}
		return price;
	}

	/**
	 * @description Calculates the profit for the trade
	 * @param currentPrice Current bitcoin price
	 * @param entryPrice Entry price of the order
	 * @param size Size of the order
	 * @param bitcoinPrice Bitcoin Price from the order (when the order was first placed)
	 * @param leverage Leverage of the order
	 */
	getProfit(currentPrice: number, entryPrice: number, size: number, bitcoinPrice: number, leverage: number, side: ORDER_SIDE){
		let profit = Utils.Instance.getProfit(currentPrice, entryPrice, size, bitcoinPrice, leverage, side);
		return profit;
		//return parseFloat(Number(((currentPrice-entryPrice)*(size/bitcoinPrice))/leverage).toString()).toFixed(4);
	}

	async setPrice(newPrice:number){
		let token = await this._authService.getToken();
		let priceResult = await PriceController.setPrice(newPrice, token.jwt);
		return priceResult;
	}
}
