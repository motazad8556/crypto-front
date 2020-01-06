import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IndexComponent as IndexPage} from './component/page/index/index.component';
import {TradeComponent as TradePage} from './component/page/trade/trade.component';
import { ProfileComponent as ProfilePage } from './component/page/profile/profile.component';
import { DepositComponent as DepositPage } from './component/page/deposit/deposit.component';
import { WithdrawComponent as WithdrawPage } from './component/page/withdraw/withdraw.component';
import { OrderHistoryComponent as OrderHistoryPage } from './component/page/order-history/order-history.component';
import { SignInComponent } from './component/page/auth/sign-in/sign-in.component';
import { SignUpComponent } from './component/page/auth/sign-up/sign-up.component';

const routes: Routes = [{
	path:'',
	component: IndexPage
},{
	path: 'trade',
	component: TradePage
},{
	path: 'profile',
	component: ProfilePage
},{
	path: 'deposit',
	component: DepositPage
}, {
	path: 'withdraw',
	component: WithdrawPage
}, {
	path: 'order_history',
	component: OrderHistoryPage
}, {
	path: 'sign_in',
	component: SignInComponent
}, {
	path: 'sign_up',
	component: SignUpComponent
}];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }