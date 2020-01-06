import { Component, OnInit } from '@angular/core';
import { WithdrawService } from 'src/app/provider/withdraw/withdraw.service';
import { QUERY_ORDER_DIR } from 'src/_client/enums/query';
import { CN_POSITION_HISTORY } from 'src/_client/enums/columnNames';
import { IWithdraw } from 'src/_client/interfaces/withdraw';

@Component({
	selector: 'app-withdraw-history',
	templateUrl: './withdraw-history.component.html',
	styleUrls: ['./withdraw-history.component.scss']
})
export class WithdrawHistoryComponent implements OnInit {
	public records:IWithdraw[] = [];
	private _skip = 0;
	private _limit = 5;
	public loading = false;
	
	constructor(
		private _WithdrawService: WithdrawService
	) { }

	ngOnInit() {
		this.fetchWithdraws();
		this.listenWithdraws();
	}

	listenWithdraws(){
		this._WithdrawService.listenWithdraws((deposit)=>{
			this.fetchWithdraws();
		});
	}

	async fetchWithdraws() {
		this.loading = true;
		try {
			let records = await this._WithdrawService.getWithdraws({
				order: QUERY_ORDER_DIR.DESC,
				orderBy: CN_POSITION_HISTORY.createdAt,
				skip: this._skip,
				limit: this._limit
      });
      console.log({records});
			this.records = records;
		} catch (e) {
			console.log(e);
		}
		this.loading = false;
	}

	goBack(){
		if(this._skip>0){
			this._skip-=this._limit;
			this.fetchWithdraws();
		}
	}

	goForth(){
		if(this.records && this.records.length==this._limit){
			this._skip+=this._limit;
			this.fetchWithdraws();
		}
	}

}
