import { Injectable } from '@angular/core';
import { MessageModalComponent } from 'src/app/component/ui/message-modal/message-modal.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(

  ) { }

  showMessageBox(title:string, message:string){
	MessageModalComponent.show(title, message);
  }

  hideMessageBox(){
	MessageModalComponent.hide();
  }
}
