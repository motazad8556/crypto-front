import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

	public get main():string{
		return "";
	}
	public get trade():string{
		return "/trade";
	}
	public get deposits():string{
		return "/deposit";
	}
	public get withdraws():string{
		return "/withdraw";
	}
	public get orderHistory():string{
		return "/order_history";
	}
	public get profile():string{
		return "/profile";
	}
	public get signIn():string{
		return "/sign_in";
	}
	public get signUp():string{
		return "/sign_up";
	}

  	constructor() { }
}
