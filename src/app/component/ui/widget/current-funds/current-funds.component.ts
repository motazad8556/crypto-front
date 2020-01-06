import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/provider/user/user.service';

@Component({
	selector: 'app-current-funds',
	templateUrl: './current-funds.component.html',
	styleUrls: ['./current-funds.component.scss']
})
export class CurrentFundsComponent implements OnInit {

	/**
	 * @description Current funds in bitcoin
	 */
	public current_funds:number = 0;
	private _loading:boolean = false;
	public get loading(){
		return this._loading;
	}

	constructor(
		private _userService: UserService
	) { }

	ngOnInit() {
		this.loadUserFunds();
		this.listenCurrentFunds();
	}

	loadUserFunds(){
		this._loading = true;
		this._userService.getFunds()
		.then((data)=>{
			if(data){
				console.log("User funds: ",data.btc_ammount);
				this.current_funds = data.btc_ammount;
			}
			this._loading = false;
		})
		.catch((err)=>{
			console.log(`Error getting current funds...\n\n`,err);
			this._loading = false;
		})
	}

	_listening:boolean = false;
	listenCurrentFunds(){
		if(this._listening){
			return;
		}
		this._listening = true;

		this._userService.listenFunds((newFunds)=>{
			console.log("NEW FUNDS RECEIVED...",newFunds);
			this.current_funds = newFunds.btc_ammount;
		});
	}

}
