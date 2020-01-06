import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/provider/auth/auth.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { RESULT_CODE, UI_RESULT_CODE, SUCCESS_UI } from 'src/_client/enums/codes';
import { LoadingService } from 'src/app/provider/loading/loading.service';
import { MessageService } from 'src/app/provider/message/message.service';
import { TextService } from 'src/app/provider/message/text.service';
import { Router } from '@angular/router';
import { ISignUpRequest } from 'src/_client/interfaces/auth';
import { USED_COUNTRIES } from 'src/_client/enums/Country';
import {IMAGE_TYPES} from 'src/_client/enums/allowedImages';
import {MAX_PROFILE_IMAGE_SIZE} from 'src/_client/enums/allowedImages';
import { RouteService } from 'src/app/provider/route/route.service';

declare var $:any;

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

	public profileForm: FormGroup;
	
	public formSent = false;
	public formSentInvalid_email = false;

	constructor(
		private _AuthService: AuthService,
		private _formBuilder: FormBuilder,
		private _LoadingService: LoadingService,
		private _MessageService: MessageService,
		private _TextService: TextService,
		public routeService: RouteService
	) {
		this.setUpForm();
	}

	setUpForm(){
		this.profileForm = this._formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
			firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
			lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
			country: [-20, [(control: FormControl)=>{
				return USED_COUNTRIES.findIndex((country)=>{
					return country.code === control.value
				}) > -1 ? null : {invalidCountry:true}
			}]],
			password: ['', [Validators.required], [(control: FormControl)=>{
				if(this.profileForm && this.profileForm.controls['password2']){
					if(this.profileForm.controls['password2'].dirty){
						this.profileForm.controls['password2'].updateValueAndValidity();
					}
				}
				return new Promise((accept)=>{
					accept(null);
				});
			}]],
			password2: ['', [Validators.required], [(control: FormControl)=>{
				if(!this.profileForm || !this.profileForm.controls['password']) return null;
				return this.hasSamePassword(control, this.profileForm.controls['password'].value);
			}]],
			accept: [true, [], [this.isTrue]]
		});
	}

	
	isTrue(control: FormControl): {[key: string]: any} {
        return new Promise( resolve => {
			resolve((control.value == true) ? null : {mustAcceptTerms:true});
        });
	}
	
	hasSamePassword(control: FormControl, otherPassword:string): {[key:string]: any}{
		return new Promise((resolve)=>{
			let hasSame = otherPassword === control.value;
			resolve(hasSame ? null: {requiresSamePassword: true});
		});
	}
	  

	ngOnInit() {
		this.listenSelectImage();
	}

	get passwordControl(){
		return this.profileForm.controls['password'];
	}

	get password2Control(){
		return this.profileForm.controls['password2'];
	}

	get acceptControl(){
		return this.profileForm.controls['accept'];
	}

	get emailControl(){
		return this.profileForm.controls['email'];
	}

	get usernameControl(){
		return this.profileForm.controls['username'];
	}

	get firstNameControl(){
		return this.profileForm.controls['firstName'];
	}

	get lastNameControl(){
		return this.profileForm.controls['lastName'];
	}

	get countryControl(){
		return this.profileForm.controls['country'];
	}

	get countries(){
		return USED_COUNTRIES;
	}

	previewImage(input: HTMLInputElement){
		if (input.files && input.files[0]) {

			if((IMAGE_TYPES.indexOf(input.files[0].type) < 0)
			|| (input.files[0].size > MAX_PROFILE_IMAGE_SIZE*1024)){
				input.value = null;
				let {title, message} = this._TextService.getErrorMessage_ui(UI_RESULT_CODE.PROFILE_IMAGE_TOO_BIG);
				this._MessageService.showMessageBox(title, message);
				return;
			}
			var reader = new FileReader();
	
			reader.onload = function (e:any) {
				console.log(input.files[0]);
				$('#previewImage').attr('src', e.target.result);
			}
			reader.readAsDataURL(input.files[0]);
		}
	}

	listenSelectImage(){
		$("#imageFile")
		.change(()=>{
			this.previewImage($("#imageFile")[0]);
		});
	}

	selectImage(){
		$("#imageFile").click();
	}

	async signUp() {
		this.formSent = true;
		if(this.profileForm.valid){
			this._LoadingService.show();
			let email = this.profileForm.controls['email'].value;
			let password = this.profileForm.controls['password'].value;
			let username = this.profileForm.controls['username'].value;
			let firstName = this.profileForm.controls['firstName'].value;
			let lastName = this.profileForm.controls['lastName'].value;
			let country = this.profileForm.controls['country'].value;
			let photo = $("#previewImage")[0].src;


			let payload:ISignUpRequest = {
				email, password, username, firstName, lastName, country, photo
			}
			console.log(`payload: `,payload);
			let result = await this._AuthService.signUp(payload);
			console.log(`RESULT: `,result);

			this._LoadingService.hide();

			if(result.result === RESULT_CODE.SUCCESS){
				let message = this._TextService.getSucessMessage(SUCCESS_UI.CREATED_ACCOUNT);
				this._MessageService.showMessageBox(message.title, message.message);
				let signInResult = await this._AuthService.signIn(email, password);
				if(signInResult.result === RESULT_CODE.SUCCESS){
					//let loggedIn = await this._AuthService.isLoggedIn();
				}else{
					let message = this._TextService.getErrorMessage(result.result);
					this._MessageService.showMessageBox(message.title, message.message);
				}
			}else{
				let message = this._TextService.getErrorMessage(result.result);
				this._MessageService.showMessageBox(message.title, message.message);
			}
		}else{
			//Show invalid message
			let message = this._TextService.getErrorMessage_ui(UI_RESULT_CODE.INVALID_DATA);
			this._MessageService.showMessageBox(message.title, message.message);
		}
	}

}
