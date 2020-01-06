import { Injectable } from '@angular/core';
import AuthController from 'src/_client/controller/auth';
import { RESULT_CODE, AUTH_STATE_CHANGE } from 'src/_client/enums/codes';
import { IAuthSchema, IAuthEvent, ISignUpRequest } from 'src/_client/interfaces/auth';
import { DatabaseService } from '../database/database.service';
import { TABLE_NAME } from 'src/_client/enums/tables';
import { EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private jsonRecord: IAuthSchema = null;
	public event: EventEmitter<IAuthEvent> = new EventEmitter();

	constructor(
		private _DatabaseService: DatabaseService
	) {
	}

	async signIn(email: string, password: string): Promise<{result:RESULT_CODE, jwt?:string, id?:number, e?:Error}> {
		try{
			let result = await AuthController.signIn({
				email, password
			});
			if(result._meta._statusCode === RESULT_CODE.SUCCESS){
				// Store new JWT
				let AUTHRecord:IAuthSchema = {
					jwt: result._payload.authToken,
					id: result._payload.id
				}
				await this._DatabaseService.purgeTable(TABLE_NAME.AUTH);
				this.jsonRecord = null;
				let res = await this._DatabaseService.createRecord(TABLE_NAME.AUTH, AUTHRecord);

				this.jsonRecord = res.data;

				this.event.emit({
					event: AUTH_STATE_CHANGE.LOGGED_IN,
					data: this.jsonRecord
				});

				return {
					result: RESULT_CODE.SUCCESS,
					jwt: result._payload.authToken,
					id: result._payload.id
				};
			}
			return {
				result:result._meta._statusCode, 
				jwt: null,
				id: null
			};
		}catch(e){
			return {
				result:RESULT_CODE.INTERNAL_ERROR,
				e:e
			};
		}
	}

	async signOut(){
		await this._DatabaseService.purgeTable(TABLE_NAME.AUTH);
		await this._DatabaseService.purgeTable(TABLE_NAME.USER);
		this.event.emit({
			event: AUTH_STATE_CHANGE.LOGGED_OUT,
			data: null
		});
	}

	async signUp(payload:ISignUpRequest): Promise<{result:RESULT_CODE, id?:number, e?:Error}> {
		try{
			let result = await AuthController.signUp(payload);
			return {
				result:result._meta._statusCode, 
				id: (result._meta._statusCode === RESULT_CODE.SUCCESS) ? result._payload.id : null
			};
		}catch(e){
			return {
				result:RESULT_CODE.INTERNAL_ERROR,
				e:e
			};
		}
	}

	async getToken(): Promise<IAuthSchema>{
		try{
			const DatabaseManager = this._DatabaseService.DatabaseManager;
			const item = DatabaseManager.db.getSchema().table(TABLE_NAME.AUTH);
			const select = DatabaseManager.db.select().from(item);
			let record:IAuthSchema[] = <any> await select.where(item.jwt.isNotNull()).exec();
			if(record){
				return record[0];
			}else{
				return null;
			}
		}catch(e){
			if(e+"".indexOf(`'Va' of null`)>-1){
				await new Promise((accept)=>{
					setTimeout(()=>{
						accept();
					},100);
				});
				return this.getToken();
			}
		}
		
	}

	async isLoggedIn(){
		return (this.jsonRecord === null) ? await (async ()=>{
			this.jsonRecord = await this.getToken();
			if(this.jsonRecord){
				this.event.emit({
					event: AUTH_STATE_CHANGE.CHANGED,
					data: this.jsonRecord
				});
			}else{
				this.event.emit({
					event: AUTH_STATE_CHANGE.CHANGED,
					data: null
				});
			}
			return !!this.jsonRecord;
		})() : this.jsonRecord;
	}

	async changePassword(password: string,newPassword: string){
		let token = await this.getToken();
		let result = await AuthController.changePassword({
			password,
			newPassword
		}, token.jwt);
		return result;
	}
}
