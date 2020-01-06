import { Component, OnInit } from '@angular/core';
//import * as $ from 'jquery';

declare var $:any;

@Component({
	selector: 'app-loading-modal',
	templateUrl: './loading-modal.component.html',
	styleUrls: ['./loading-modal.component.scss']
})
export class LoadingModalComponent implements OnInit {

	constructor() { }

	ngOnInit() {
		$('#loading-modal');
	}

	static showLoading() {
		$('#loading-modal').modal("show");
	}

	static hideLoading(){
		$('#loading-modal').modal('hide');
	}

}
