import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/provider/loading/loading.service';
import { TextService } from 'src/app/provider/message/text.service';
import { DepositService } from 'src/app/provider/deposit/deposit.service';
import { RESULT_CODE, SUCCESS_UI } from 'src/_client/enums/codes';
import { MessageService } from 'src/app/provider/message/message.service';

@Component({
	selector: 'app-deposit-widget',
	templateUrl: './deposit.component.html',
	styleUrls: ['./deposit.component.scss']
})
export class DepositWidgetComponent implements OnInit {
	public depositForm: FormGroup;
	constructor(
		private _formBuilder: FormBuilder,
		private _LoadingService: LoadingService,
		private _depositService: DepositService,
		private _MessageService: MessageService,
		private _TextService: TextService) {

	}

	ngOnInit() {
		this.setUpForm();
	}

	setUpForm() {
		this.depositForm = this._formBuilder.group({
			depositammount: [100, [Validators.required, Validators.min(.00000001)]],
			depositAddress: [(Math.random()*1e16).toString(16), [Validators.required, Validators.min(.00000001)]]
		});
	}

	async placeDeposit() {
		this._LoadingService.show();
		if (this.depositForm.valid) {
			try{
				let result = await this._depositService.makeDeposit(this.depositForm.value['depositammount'], this.depositForm.value['depositAddress']);
				if(result._meta._statusCode !== RESULT_CODE.SUCCESS){
					let data = this._TextService.getErrorMessage(result._meta._statusCode);
					this._MessageService.showMessageBox(data.title, data.message);
				}else{
					let data = this._TextService.getSucessMessage(SUCCESS_UI.DEPOSIT_MADE);
					this._MessageService.showMessageBox(data.title, data.message);
				}
			}catch(e){
				console.log(e);
				let data = this._TextService.getErrorMessage(RESULT_CODE.INTERNAL_ERROR);
				this._MessageService.showMessageBox(data.title, data.message);
			}
		}
		this._LoadingService.hide();
	}

}
