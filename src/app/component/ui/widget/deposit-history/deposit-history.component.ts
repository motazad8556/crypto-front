import { Component, OnInit } from '@angular/core';
import { DepositService } from 'src/app/provider/deposit/deposit.service';
import { QUERY_ORDER_DIR } from 'src/_client/enums/query';
import { CN_POSITION_HISTORY } from 'src/_client/enums/columnNames';
import { IDeposit } from 'src/_client/interfaces/deposit';

@Component({
	selector: 'app-deposit-history',
	templateUrl: './deposit-history.component.html',
	styleUrls: ['./deposit-history.component.scss']
})
export class DepositHistoryComponent implements OnInit {
	public records:IDeposit[] = [];
	private _skip = 0;
	private _limit = 5;
	public loading = false;
	
	constructor(
		private _DepositService: DepositService
	) { }

	ngOnInit() {
		this.fetchDeposits();
		this.listenDeposits();
	}

	listenDeposits(){
		this._DepositService.listenDeposits((deposit)=>{
			this.fetchDeposits();
		});
	}

	async fetchDeposits() {
		this.loading = true;
		try {
			let records = await this._DepositService.getDeposits({
				order: QUERY_ORDER_DIR.DESC,
				orderBy: CN_POSITION_HISTORY.createdAt,
				skip: this._skip,
				limit: this._limit
			});
			this.records = records;
		} catch (e) {
			console.log(e);
		}
		this.loading = false;
	}

	goBack(){
		if(this._skip>0){
			this._skip-=this._limit;
			this.fetchDeposits();
		}
	}

	goForth(){
		if(this.records && this.records.length==this._limit){
			this._skip+=this._limit;
			this.fetchDeposits();
		}
	}

}
