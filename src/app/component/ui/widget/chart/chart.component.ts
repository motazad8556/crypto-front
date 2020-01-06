import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';


@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

	constructor(
		private renderer2: Renderer2,
	    @Inject(DOCUMENT) private _document
	) {
	}

	ngOnInit() {
		this.initializeWidget();
	}

	async getSecureScript(url:string){
		const s = this.renderer2.createElement('script');
		s.type = 'text/javascript';
		s.src = url;
		s.text = ``;
		this.renderer2.appendChild(this._document.body, s);
		await new Promise((accept)=>{
			let checker = setInterval(()=>{
				if(window['TradingView']){
					accept();
					clearInterval(checker);
				}else{
					console.log("Nothing yet...");
				}
			},100);
		});
	}

	async initializeWidget() {
		//await this.getSecureScript('https://s3.tradingview.com/tv.js');
		let widget = window['activateTradingView']({
			"autosize": true,
			"symbol": "BITMEX:XBT",
			"interval": "1",
			"timezone": "Etc/UTC",
			"theme": "Light",
			"style": "2",
			"locale": "en",
			"toolbar_bg": "#f1f3f6",
			"enable_publishing": false,
			"allow_symbol_change": true,
			"container_id": "tradingview_d385d"
		})
		console.log(widget);
	}

}
/**
 * <!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div id="tradingview_d385d"></div>
  <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/BITMEX-XBT/" rel="noopener" target="_blank"><span class="blue-text">XBT Chart</span></a> by TradingView</div>
  <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
  <script type="text/javascript">
  new TradingView.widget(
  {
  "autosize": true,
  "symbol": "BITMEX:XBT",
  "interval": "1",
  "timezone": "Etc/UTC",
  "theme": "Dark",
  "style": "2",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
  "container_id": "tradingview_d385d"
}
  );
  </script>
</div>
<!-- TradingView Widget END -->
 *
*/