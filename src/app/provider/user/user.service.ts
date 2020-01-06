import { Injectable } from '@angular/core';
import { IAccountUITable } from 'src/_client/interfaces/user';
import UserController from 'src/_client/controller/user';
import { AuthService } from '../auth/auth.service';
import { RESULT_CODE, UI_RESULT_CODE } from 'src/_client/enums/codes';
import { DatabaseService } from '../database/database.service';
import { TABLE_NAME, TABLE_FIELD_USER, FIELD_NAMES_USER_RECORD } from 'src/_client/enums/tables';
import FundsController from 'src/_client/controller/funds';
import { IFunds } from 'src/_client/interfaces/funds';
import { CN_USER_INCLUDE_REL } from 'src/_client/enums/columnNames';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor(
		private _authService: AuthService,
		private _databaseService: DatabaseService
	) { }

	async getFunds():Promise<IFunds>{
		let token = await this._authService.getToken();
		let userRecord = await UserController.fetchAccount({
			fields:['id'],
			relations:[CN_USER_INCLUDE_REL.funds]
		}, token.jwt);
		if(userRecord._meta._statusCode === RESULT_CODE.SUCCESS){
			return userRecord._payload.funds;
		}else{
			return null;
		}
	}

	async listenFunds(callback: (order: IFunds) => void){
		let token = await this._authService.getToken();
		if(token && token.id){
			FundsController.listenFundsUpdated(token.id, callback);
		}
	}

	/**
	 * @description Gets the current user record.
	 * If exists, attempts to update it if required.
	 */
	async getUser():Promise<{result:RESULT_CODE, data?:IAccountUITable | any, e?:Error}>{
		console.log("--- 1");
		try{
			console.log("--- 2");
			let tokenResult = await this._authService.getToken();
			if(!tokenResult){
				return {
					result: RESULT_CODE.INVALID_TOKEN
				}
			}
			let jwt = tokenResult.jwt;
			let response = await UserController.fetchAccount({
				fields:[
					FIELD_NAMES_USER_RECORD.updatedAt,
					FIELD_NAMES_USER_RECORD.id
				]
			}, jwt);

			if(response._meta._statusCode === RESULT_CODE.SUCCESS){
				console.log("--- 3");
				//Compare with local version. If different, update.

				let {item, select} = this._databaseService.getSelect(TABLE_NAME.USER)
				console.log("--- 3-0");
				let responseB = await select.limit(1).exec();
				let userData:IAccountUITable = (<any>responseB[0]);
				console.log("--- 3-1");
				console.log(userData);
				console.log(response._payload);				
				//If found the user data locally cached
				if(userData){
					console.log("4 --");
					if(
						userData.updatedAt &&
						(userData.updatedAt.getTime() == new Date(response._payload.updatedAt).getTime())
					){
						let {item, select} = this._databaseService.getSelect(TABLE_NAME.USER)
						userData = <any>(await select.where(item[TABLE_FIELD_USER.id].eq(response._payload.id)).limit(1).exec())[0];
						console.log("--- 5");
						return {
							result: RESULT_CODE.SUCCESS,
							data: userData
						};
					}
					console.log("--- 6");
				}
				console.log("--- 7");
				let fieldsToReturn = Object.values(FIELD_NAMES_USER_RECORD);
				response = await UserController.fetchAccount({
					fields:fieldsToReturn
				}, jwt);
				console.log("--- 8");
				if(response._meta._statusCode === RESULT_CODE.SUCCESS){
					//Save current data and return the stored record

					let record:IAccountUITable = {
						id: response._payload.id,
						createdAt: new Date(response._payload.createdAt),
						updatedAt: new Date(response._payload.updatedAt),
						firstName: response._payload.firstName,
						lastName: response._payload.lastName,
						username: response._payload.username,
						email: response._payload.email,
						country: response._payload.country,
						photo: response._payload.photo	/**		IMAGE FILE ON BASE64	*/
					};
					console.log("--- 9");

					console.log(record);

					let {inserted, code, data} = await this._databaseService.updateRecord(TABLE_NAME.USER, record);

					if(inserted && code === UI_RESULT_CODE.SUCCESS){
						console.log("--- 10");
						return {
							result: RESULT_CODE.SUCCESS,
							data: data[0]
						}
					}else{
						console.log("--- 11");
						return {
							result: RESULT_CODE.INTERNAL_ERROR
							,data: {
								inserted, code, data
							}
						}
					}
				}else{
					console.log("--- 12");
					return {
						result: response._meta._statusCode
					}
				}
			}
			return {				
				result: response._meta._statusCode,
				data: response
			}
		}catch(e){
			console.log("--- 14");
			throw e;
		}
	}
}
