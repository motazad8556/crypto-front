import { Injectable, ViewChild } from '@angular/core';
import { LoadingModalComponent } from 'src/app/component/ui/loading-modal/loading-modal.component';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {

	@ViewChild("loadingModal") loadingModalComponent: LoadingModalComponent;

	constructor() { }

	show() {
		LoadingModalComponent.showLoading();
	}

	hide() {
		LoadingModalComponent.hideLoading();
	}
}
