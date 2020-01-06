import { Injectable } from '@angular/core';
import { Utils } from 'src/_client/utils';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  constructor() { }

  formatDisplayDate(date: Date) {
    return Utils.Instance.formatDisplayDate(date);
  }
}
