import { Component, OnInit } from '@angular/core';

declare var $:any;

@Component({
	selector: 'app-message-modal',
	templateUrl: './message-modal.component.html',
	styleUrls: ['./message-modal.component.scss']
})
export class MessageModalComponent implements OnInit {

	static title: string;
	static _body: string;

	get title(){
		return MessageModalComponent.title;
	}

	get body(){
		return MessageModalComponent._body;
	}

	constructor() { }

	ngOnInit() {
	}

	static show(title:string, body: string) {
		console.log("Showing modal...");
		this.title = title;
		this._body = body;
		$('#messageBox').modal('show');
	}

	static hide(){
		this.title = "";
		this._body = "";
		$('#messageBox').modal('hide');
	}

	hide(){
		MessageModalComponent.hide();
	}
}
