import { Injectable } from '@angular/core';
import DatabaseManager from 'src/_client/manager/DatabaseManager';
import {TABLE_NAME} from 'src/_client/enums/tables';
import { UI_RESULT_CODE } from 'src/_client/enums/codes';
import { query } from 'lovefield';

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {

	constructor() { }

	async init() {
		await DatabaseManager.init();
	}

	async createRecord(table:TABLE_NAME, data:any):Promise<{inserted:boolean, code:UI_RESULT_CODE, data:any}>{
		let schema = DatabaseManager.db.getSchema().table(table);
		let row = schema.createRow(data);
		try{
			let record = await DatabaseManager.db.insert().into(schema).values([row]).exec();
			return {
				inserted: true, data: record, code: UI_RESULT_CODE.SUCCESS
			};
		}catch(e){
			return {
				inserted: false, data:e, code: UI_RESULT_CODE.ERROR_INSERTING_DATA
			};
		}
	}

	async updateRecord(table:TABLE_NAME, data:any):Promise<{inserted:boolean, code:UI_RESULT_CODE, data:any}>{
		let schema = DatabaseManager.db.getSchema().table(table);
		let row = schema.createRow(data);
		try{
			let record = await DatabaseManager.db.insertOrReplace().into(schema).values([row]).exec();
			return {
				inserted: true, data: record, code: UI_RESULT_CODE.SUCCESS
			};
		}catch(e){
			return {
				inserted: false, data:e, code: UI_RESULT_CODE.ERROR_INSERTING_DATA
			};
		}
	}

	async purgeTable(table:TABLE_NAME){
		let schema = DatabaseManager.db.getSchema().table(table);
		await DatabaseManager.db.delete().from(schema).exec();
	}

	getSelect(table: TABLE_NAME){
		const item = DatabaseManager.db.getSchema().table(table);
		const select = DatabaseManager.db.select().from(item);
		return {
			item, select
		};
	}

	get DatabaseManager(){
		return DatabaseManager;
	}

}
