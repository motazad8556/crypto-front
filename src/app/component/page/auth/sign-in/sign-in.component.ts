import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/provider/loading/loading.service';
import { MessageService } from 'src/app/provider/message/message.service';
import { TextService } from 'src/app/provider/message/text.service';
import { UI_RESULT_CODE, RESULT_CODE, SUCCESS_UI } from 'src/_client/enums/codes';
import { AuthService } from 'src/app/provider/auth/auth.service';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

	public signInForm: FormGroup;

	constructor(
		private _formBuilder: FormBuilder,
		private _LoadingService: LoadingService,
		private _MessageService: MessageService,
		private _TextService: TextService,
		private _AuthService: AuthService
	) {
		this.setUpForm();
	}

	setUpForm() {
		this.signInForm = this._formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.minLength(3), Validators.maxLength(20)]]
		});
	}



	ngOnInit() {
	}

	async signIn() {
		if(this.signInForm.valid){
			this._LoadingService.show();
			let {title, message} = this._TextService.getSucessMessage(SUCCESS_UI.LOGGED_IN);
			let resPayload = await this._AuthService.signIn(this.signInForm.controls['email'].value, this.signInForm.controls['password'].value);
			
			if(resPayload.result !== RESULT_CODE.SUCCESS){
				let text = this._TextService.getErrorMessage_ui(UI_RESULT_CODE.INVALID_DATA);	
				title = text.title;
				message = text.message;
			}

			this._MessageService.showMessageBox(title, message);
			this._LoadingService.hide();
		}else{
			let {title, message} = this._TextService.getErrorMessage_ui(UI_RESULT_CODE.INVALID_DATA);
			this._MessageService.showMessageBox(title, message);
		}
	}

}
