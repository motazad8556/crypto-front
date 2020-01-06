import { Injectable } from '@angular/core';
import {
	IOpenPosition,
	IFetchOpenPositionQuery } from 'src/_client/interfaces/openPosition';
import OrderController from 'src/_client/controller/order';
import { AuthService } from '../auth/auth.service';
import { EventEmitter } from 'events';
import { IOpenOrderCreateRequestPayload, IFetchOpenOrderQuery, IOpenOrder } from 'src/_client/interfaces/openOrder';
import { IFetchPositionHistoryQuery, IPositionHistory } from 'src/_client/interfaces/positionHistory';

@Injectable({
	providedIn: 'root'
})
export class OrderService {

	private _emitter:EventEmitter;
	private _currentUserID: number;

	constructor(
		private _AuthService: AuthService
	) { }

	async listenNewOpenOrder(callback:(order: IOpenOrder) => void){
		let token = await this._AuthService.getToken();
		OrderController.listenNewOrderAdded(token.id, callback);
	}

	async listenOpenOrderRemoved(callback:(order: IOpenOrder) => void){
		let token = await this._AuthService.getToken();
		OrderController.listenOpenOrderRemoved(token.id, callback);
	}

	async listenOpenOrderUpgraded(callback:(order: IOpenOrder) => void){
		let token = await this._AuthService.getToken();
		OrderController.listenOpenOrderUpgraded(token.id, callback);
	}

	async listenOpenOrderCancelled(callback:(order: IOpenOrder) => void){
		let token = await this._AuthService.getToken();
		OrderController.listenOpenOrderCancelled(token.id, callback);
	}
	
	async listenNewOpenPositions(callback:(newOrder: IOpenPosition) => void){
		let token = await this._AuthService.getToken();
		OrderController.listenNewOpenPositionAdded(token.id, callback);
	}
	
	async listenOpenPositionClosedAMP(callback:(newOrder: IOpenPosition) => void){
		let token = await this._AuthService.getToken();
		OrderController.listenOpenPositionClosedAMP(token.id, callback);
	}
	
	async listenOpenPositionRemoved(callback:(newOrder: IOpenPosition) => void){
		let token = await this._AuthService.getToken();
		OrderController.listenOpenPositionRemoved(token.id, callback);
	}

	async fetchOpenPositions(options:IFetchOpenPositionQuery){
		let token = await this._AuthService.getToken();
		let orders = await OrderController.fetchOpenPositions(options, token.jwt);
		return orders._payload.records;
	}

	async fetchOpenOrders(options:IFetchOpenOrderQuery){
		let token = await this._AuthService.getToken();
		let orders = await OrderController.fetchOpenOrders(options, token.jwt);
		return orders._payload.records;
	}

	async fetchPositionHistory(options:IFetchPositionHistoryQuery){
		let token = await this._AuthService.getToken();
		let orders = await OrderController.fetchPositionHistory(options, token.jwt);
		return {records: orders._payload.records, count: orders._payload.count};
	}

	async listenNewPositionHistoryAdded(callback:(newOrder: IPositionHistory) => void){
		let token = await this._AuthService.getToken();
		OrderController.listenNewOrderHistoryAdded(token.id, callback);
	}
	
	async addNewOrder(request:IOpenOrderCreateRequestPayload){
		let token = await this._AuthService.getToken();
		let newOrder = await OrderController.createNewOrder(request, token.jwt);
		return newOrder;
	}

	async cancelOpenOrder(orderId: string){
		let token = await this._AuthService.getToken();
		let deleteResult = await OrderController.cancelOpenOrder({
			orderId
		}, token.jwt);
		return deleteResult;
	}

	async closeOpenPositionAMP(positionId: string){
		let token = await this._AuthService.getToken();
		let deleteResult = await OrderController.closeOpenPositionAtMarketPrice({
			positionId
		}, token.jwt);
		return deleteResult;
	}

	async saveOpenPositionExitPrice(positionId: string, newPrice:number){
		let token = await this._AuthService.getToken();
		let updateResult = await OrderController.updateOpenPosition({
			field:{
				exit_price: newPrice
			}, positionId
		}, token.jwt);
		return updateResult;
	}

	async saveOpenPositionStopPrice(positionId: string, newPrice:number){
		let token = await this._AuthService.getToken();
		let updateResult = await OrderController.updateOpenPosition({
			field:{
				stop_price: newPrice
			}, positionId
		}, token.jwt);
		return updateResult;
	}

	async saveOpenOrderStopPrice(orderId: string, newPrice:number){
		let token = await this._AuthService.getToken();
		let updateResult = await OrderController.updateOpenOrder({
			field:{
				stop_price: newPrice
			}, orderId
		}, token.jwt);
		return updateResult;
	}

	async saveOpenOrderExitPrice(orderId: string, newPrice:number){
		let token = await this._AuthService.getToken();
		let updateResult = await OrderController.updateOpenOrder({
			field:{
				exit_price: newPrice
			}, orderId
		}, token.jwt);
		return updateResult;
	}
}
