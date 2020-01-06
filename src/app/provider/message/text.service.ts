import { Injectable } from '@angular/core';
import { RESULT_CODE, UI_RESULT_CODE, SUCCESS_UI } from 'src/_client/enums/codes';
import { MAX_PROFILE_IMAGE_SIZE } from 'src/_client/enums/allowedImages';
import {ERROR_MESSAGES, SUCCESS_MESSAGES, UI_ERROR_CODES} from 'src/_client/enums/uiMessages';

@Injectable({
	providedIn: 'root'
})
export class TextService {

	constructor() { }

	public getErrorMessage_ui(which: UI_RESULT_CODE): { title: string, message: string } {
		let message = UI_ERROR_CODES[which];
		if(message.title.indexOf('_MAX_PROFILE_IMAGE_SIZE_')>-1){
			message.title = message.title.replace('_MAX_PROFILE_IMAGE_SIZE_', Math.floor(MAX_PROFILE_IMAGE_SIZE / 1024)+"")
		}
		if(message.message.indexOf('_MAX_PROFILE_IMAGE_SIZE_')>-1){
			message.message = message.message.replace('_MAX_PROFILE_IMAGE_SIZE_', Math.floor(MAX_PROFILE_IMAGE_SIZE / 1024)+"")
		}
		return message;
	}

	public getSucessMessage(which: SUCCESS_UI): { title: string, message: string } {
		return SUCCESS_MESSAGES[which] || {
			title: "Success",
			message: "Operation completed successfully"
		};
	}

	public getErrorMessage(code: RESULT_CODE): { title: string, message: string } {
		return ERROR_MESSAGES[code] || {
			title: "Unknown Error",
			message: `There has been an error (${code}). Please try again later.`
		};
	}
}
