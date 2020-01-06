import { Injectable } from '@angular/core';
import WithdrawController from 'src/_client/controller/withdraw';
import { AuthService } from '../auth/auth.service';
import { IDepositCreateResponse } from 'src/_client/interfaces/requests';
import { IWithdrawFetchQuery, IWithdraw } from 'src/_client/interfaces/withdraw';

@Injectable({
	providedIn: 'root'
})
export class WithdrawService {

	constructor(
		private _AuthService: AuthService
	) { }

	async makeWithdraw(btc_ammount: number, btc_address: string): Promise<IDepositCreateResponse> {
		let token = await this._AuthService.getToken();
		let result = await WithdrawController.createNewWithdraw({
			btc_ammount,
			btc_address,
			token: 'btc'
		}, token.jwt);
		return result;
	}

	async getWithdraws(details: IWithdrawFetchQuery) {
		let token = await this._AuthService.getToken();
		let result = await WithdrawController.fetchWithdraws(details, token.jwt);
		return result._payload.records;
	}

	async listenWithdraws(callback:(withdraw: IWithdraw) => void) {
		let token = await this._AuthService.getToken();
		let result = await WithdrawController.listenNewWithdrawAdded(token.id, callback);
	}
}
