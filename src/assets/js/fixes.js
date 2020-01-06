var global = global || window;
var Buffer = Buffer || [];
var process = process || {
  env: { DEBUG: undefined },
  version: []
};


window.activateTradingView = function(options){
	return new TradingView.widget(options);
}