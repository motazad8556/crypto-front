import { Injectable } from '@angular/core';
import DepositController from 'src/_client/controller/deposit';
import { AuthService } from '../auth/auth.service';
import { IDepositCreateResponse } from 'src/_client/interfaces/requests';
import { IDepositFetchQuery, IDeposit } from 'src/_client/interfaces/deposit';

@Injectable({
	providedIn: 'root'
})
export class DepositService {

	constructor(
		private _AuthService: AuthService
	) { }

	async makeDeposit(btc_ammount: number, btc_address: string): Promise<IDepositCreateResponse> {
		let token = await this._AuthService.getToken();
		let result = await DepositController.createNewDeposit({
			btc_ammount,
			btc_address
		}, token.jwt);
		return result;
	}

	async getDeposits(details: IDepositFetchQuery) {
		let token = await this._AuthService.getToken();
		let result = await DepositController.fetchDeposits(details, token.jwt);
		return result._payload.records;
	}

	async listenDeposits(callback:(order: IDeposit) => void) {
		let token = await this._AuthService.getToken();
		let result = await DepositController.listenNewDepositAdded(token.id, callback);
	}
}
