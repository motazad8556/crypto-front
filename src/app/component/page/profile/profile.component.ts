import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/provider/user/user.service';
import { LoadingService } from 'src/app/provider/loading/loading.service';
import { IAccountUITable } from 'src/_client/interfaces/user';
import { RESULT_CODE, UI_RESULT_CODE, SUCCESS_UI } from 'src/_client/enums/codes';
import { TextService } from 'src/app/provider/message/text.service';
import { MessageService } from 'src/app/provider/message/message.service';
import { USED_COUNTRIES } from 'src/_client/enums/Country';
import { FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/provider/auth/auth.service';


@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	public user: IAccountUITable;
	public changePasswordForm: FormGroup;

	constructor(
		private _userService: UserService,
		private _loadingService: LoadingService,
		private _textService: TextService,
		private _messageService: MessageService,
		private _FormBuilder: FormBuilder,
		private _AuthService: AuthService
	) {
		this.buildChangePasswordForm();
	}

	ngOnInit() {
		this.loadProfile();
	}
	
	buildChangePasswordForm(){
		this.changePasswordForm = this._FormBuilder.group({
			current : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
			,new : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
			,new2 : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20),
			(control: FormControl)=>{
				if(this.changePasswordForm && this.changePasswordForm.controls){
					return control.value === this.changePasswordForm.controls['new'].value ? null : {notEqual:true}
				}
			}]]
		})
	}

	get new2Control(){
		return this.changePasswordForm.controls['new2'];
	}

	async loadProfile() {
		//let user = await this._userService.getUser();
		this._loadingService.show();
		setTimeout(async () => {
			let userResult = await this._userService.getUser();
			this._loadingService.hide();
			if (userResult.result === RESULT_CODE.SUCCESS) {
				this.user = userResult.data;
				this._loadingService.hide();
			} else {
				let { title, message } = this._textService.getErrorMessage(userResult.result);
				this._messageService.showMessageBox(title, message);
			}
		}, 1000);
	}

	async changePassword(){
		//console.log(this.changePasswordForm);
		if(this.changePasswordForm.valid){
			this._loadingService.show();
			let response = await this._AuthService.changePassword(
				this.changePasswordForm.controls['current'].value, 
				this.changePasswordForm.controls['new'].value
			);
			this._loadingService.hide();
			if(response._payload.changed){
				let {title, message} = this._textService.getSucessMessage(SUCCESS_UI.CHANGED_PASSWORD);
				this._messageService.showMessageBox(title, message);
			}else{
				let {title, message} = this._textService.getErrorMessage(response._meta._statusCode);
				this._messageService.showMessageBox(title, message);
			}
		}else{
			let {title, message} = this._textService.getErrorMessage_ui(UI_RESULT_CODE.INVALID_DATA);
			this._messageService.showMessageBox(title, message);
		}
	}

	getPass2control(){
		return this.changePasswordForm.controls['new2'];
	}

	getCountry(countryCode: string){
		let found = USED_COUNTRIES.find((country)=>{
			return (country.code === countryCode);
		});
		return found ? found.name : countryCode;
	}

	get countries(){
		return USED_COUNTRIES;
	}

}
