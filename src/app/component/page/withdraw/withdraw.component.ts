import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { WithdrawService } from 'src/app/provider/withdraw/withdraw.service';
import { LoadingService } from 'src/app/provider/loading/loading.service';
import { MessageService } from 'src/app/provider/message/message.service';
import { RESULT_CODE, SUCCESS_UI } from 'src/_client/enums/codes';
import { TextService } from 'src/app/provider/message/text.service';
import { UserService } from 'src/app/provider/user/user.service';

@Component({
	selector: 'app-withdraw',
	templateUrl: './withdraw.component.html',
	styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {
	public withdrawForm: FormGroup;

	constructor(
		private _FormBuilder: FormBuilder,
		private _WithdrawService: WithdrawService,
		private _LoadingService: LoadingService,
		private _MessageService: MessageService,
		private _TextService: TextService,
		private _UserService: UserService) {
		this.setForm();
		
	}

	ngOnInit() {
	}

	setForm() {
		this.withdrawForm = this._FormBuilder.group({
			token: ['btc', [Validators.required]]
			, address: [new Date().getTime().toString(16), [Validators.required, Validators.minLength(3), Validators.maxLength(40)]]
			, ammount: [0.000001, [Validators.required, Validators.min(0.000000001)]]
			, network_fee: ['1']
		});
	}

	async placeNewWithdraw() {
		if(this.withdrawForm.valid){
			let {ammount, address} = this.withdrawForm.controls;
			this._LoadingService.show();
			let response = await this._WithdrawService.makeWithdraw(ammount.value, address.value);
			this._LoadingService.hide();
			if(response._meta._statusCode === RESULT_CODE.SUCCESS){
				let { title, message } = this._TextService.getSucessMessage(SUCCESS_UI['WITHDRAW_MADE']);
				this._MessageService.showMessageBox(title, message);
			}else{
				let { title, message } = this._TextService.getErrorMessage(response._meta._statusCode);
				this._MessageService.showMessageBox(title, message);
			}
		}
	}

	async setAllFunds(){
		let funds = await this._UserService.getFunds();
		this.withdrawForm.controls.ammount.setValue(funds.btc_ammount);
	}

}
