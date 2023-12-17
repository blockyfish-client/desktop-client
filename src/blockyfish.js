// Game object script injector
// Made by TheJ, aka noam
const old = Function.prototype.bind;
let game;
const bind = function (...args) {
	if (this == console.log) {
		return old.apply(this, args);
	}
	if (Function.prototype.bind == old) {
		return old.apply(this, args);
	} else if (args[0] && Object.prototype.hasOwnProperty.call(args[0], "currentScene")) {
		console.log("%c[TheJ Injector] Logged game object.", "color: #ff6969; font-size:125%");
		game = args[0];
		window.game = game;
	}
	return old.apply(this, args);
};
Function.prototype.bind = bind;

class Blockyfish {
	constructor(window) {
		this.window = window;
		this.events = {
			first_game_load: new Event("first-game-load", { bubbles: true, cancelable: false }),
			game_load: new Event("game-load", { bubbles: true, cancelable: false }),
			death: new Event("death", { bubbles: true, cancelable: false }),
			settings_open: new Event("settings-open", { bubbles: true, cancelable: false }),
			forums_open: new Event("forums-open", { bubbles: true, cancelable: false })
		};
	}
	emit(event) {
		dispatchEvent(event);
	}
	addEventListener(event, callback) {
		addEventListener(event, callback);
	}
	removeEventListener(event, callback) {
		removeEventListener(event, callback);
	}
}

module.exports = { Blockyfish };
