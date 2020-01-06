import { Component, OnInit } from '@angular/core';
import { RouteService } from 'src/app/provider/route/route.service';
import { AuthService } from 'src/app/provider/auth/auth.service';
import { AUTH_STATE_CHANGE } from 'src/_client/enums/codes';
import { Router } from '@angular/router';
import { IAuthEvent } from 'src/_client/interfaces/auth';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

	public isLoggedIn: boolean;

	constructor(
		public _RouteService: RouteService,
		private _AuthService: AuthService,
		private _router: Router
	) {
		this.listenAuth();
	}

	ngOnInit() {
		this.initialize()
		.catch((err)=>{
			console.log("Error initializing...",err);
		});
	}

	async initialize(){
		let token = await this._AuthService.getToken();
		this.isLoggedIn = (!!token && !!token.jwt);
	}

	listenAuth() {
		this._AuthService.event.subscribe((payload: IAuthEvent) => {
			if (payload.event === AUTH_STATE_CHANGE.LOGGED_IN) {
				this.isLoggedIn = true;
				this._router.navigate(['profile']);
			} else if (payload.event === AUTH_STATE_CHANGE.LOGGED_OUT) {
				this.isLoggedIn = false;
				this._router.navigate(['sign_in']);
			} else if (payload.event === AUTH_STATE_CHANGE.CHANGED) {
				this.isLoggedIn = payload.data && payload.data.jwt;
			}
		});
	}

	signOut() {
		this._AuthService.signOut()
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

}
