import 'reflect-metadata';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './component/page/index/index.component';
import { NavbarComponent } from './component/ui/navbar/navbar.component';
import { FooterComponent } from './component/ui/footer/footer.component';
import { TradeComponent } from './component/page/trade/trade.component';
import { BuySellComponent } from './component/ui/widget/buy-sell/buy-sell.component';
import { OrderbookComponent } from './component/ui/widget/orderbook/orderbook.component';
import { ChartComponent } from './component/ui/widget/chart/chart.component';
import { OPOOOHistoryComponent } from './component/ui/widget/op-oo-ohistory/op-oo-ohistory.component';
import { OpenOrdersComponent } from './component/ui/widget/open-orders/open-orders.component';
import { OpenPositionsComponent } from './component/ui/widget/open-positions/open-positions.component';
import { OrderHistoryComponent } from './component/ui/widget/order-history/order-history.component';
import { OrderHistoryComponent as OrderHistoryPage } from './component/page/order-history/order-history.component';
import { ProfileComponent } from './component/page/profile/profile.component';
import { DepositComponent } from './component/page/deposit/deposit.component';
import { WithdrawComponent } from './component/page/withdraw/withdraw.component';
import { WithdrawHistoryComponent } from './component/ui/widget/withdraw-history/withdraw-history.component';
import { DepositHistoryComponent } from './component/ui/widget/deposit-history/deposit-history.component';
import { SignInComponent } from './component/page/auth/sign-in/sign-in.component';
import { SignUpComponent } from './component/page/auth/sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModalComponent } from './component/ui/loading-modal/loading-modal.component';
import { MessageModalComponent } from './component/ui/message-modal/message-modal.component';
import { InitService } from './provider/init/init.service';
import { DatabaseService } from './provider/database/database.service';
import { PriceComponent } from './component/ui/widget/price/price.component';
import { NumeralPipe } from './pipe/formatting/numeral.pipe';
import { RecentTradesComponent } from './component/ui/widget/recent-trades/recent-trades.component';
import { MomentPipe } from './pipe/formatting/moment.pipe';
import { CurrentFundsComponent } from './component/ui/widget/current-funds/current-funds.component';
import { DepositWidgetComponent } from './component/ui/widget/deposit/deposit.component';



export function initializeApp(database: DatabaseService, appInitService: InitService) {
	return (): Promise<any> => {
		console.log('initializeApp -- 1');
		return appInitService.init();
	}
}


@NgModule({
	declarations: [
		AppComponent,
		IndexComponent,
		NavbarComponent,
		FooterComponent,
		TradeComponent,
		BuySellComponent,
		OrderbookComponent,
		ChartComponent,
		OPOOOHistoryComponent,
		OpenOrdersComponent,
		OpenPositionsComponent,
		OrderHistoryComponent,
		ProfileComponent,
		DepositComponent,
		WithdrawComponent,
		OrderHistoryPage,
		WithdrawHistoryComponent,
		DepositHistoryComponent,
		SignInComponent,
		SignUpComponent,
		LoadingModalComponent,
		MessageModalComponent,
		PriceComponent,
		NumeralPipe,
		RecentTradesComponent,
		MomentPipe,
		CurrentFundsComponent,
		DepositWidgetComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [
		InitService,
		DatabaseService,
		{ provide: APP_INITIALIZER, useFactory: initializeApp, deps: [DatabaseService, InitService], multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
