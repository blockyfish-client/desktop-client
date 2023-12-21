const old = Function.prototype.bind;
let game;
const bind = function (...args) {
	if (this == console.log) {
		return old.apply(this, args);
	}
	if (Function.prototype.bind == old) {
		return old.apply(this, args);
	} else if (args[0] && Object.prototype.hasOwnProperty.call(args[0], "currentScene")) {
		// Game object script injector
		// Made by TheJ, aka noam
		console.log("%c[TheJ Injector] Logged game object.", "color: #ff6969; font-size:125%");
		game = args[0];
		window.game = game;
	} else if (args[0] && Object.prototype.hasOwnProperty.call(args[0], "prepareUpload")) {
		// GIF pfp upload patch injector
		// Made by Pi

		// console log throttling
		if (Date.now() - (window.pi_igpup_llts || 0) > 1000) {
			window.pi_igpup_llts = Date.now();
			console.log("%c[Pi Injector] Injected GIF pfp uploader patch.", "color: #e9c2ff; font-size:125%");
		}
		var opu = args[0].prepareUpload;
		args[0].prepareUpload = function () {
			args[0].createImgUrl = args[0].sourceImgUrl;
			return opu.apply(this);
		};
		game = args[0];
		window.game = game;
	}
	return old.apply(this, args);
};
Function.prototype.bind = bind;

class Blockyfish {
	constructor(window) {
		this.events = {
			"first-game-load": new Event("first-game-load", { bubbles: true, cancelable: false }),
			"game-load": new Event("game-load", { bubbles: true, cancelable: false }),
			"play-button-click": new Event("play-button-click", { bubbles: true, cancelable: false }),
			"death": new Event("death", { bubbles: true, cancelable: false }),
			"settings-open": new Event("settings-open", { bubbles: true, cancelable: false }),
			"forums-open": new Event("forums-open", { bubbles: true, cancelable: false })
		};
		// makes it harder to tamper with blockyfish info
		this.config = window.bfi;
		window.bfi = undefined;
	}
	emit(event) {
		if (!this.events[event]) return false;
		document.dispatchEvent(this.events[event]);
		return true;
	}
	addEventListener(event, callback) {
		if (!this.events[event] || !callback) return false;
		document.addEventListener(this.events[event], callback);
		return true;
	}
	removeEventListener(event, callback) {
		if (!this.events[event] || !callback) return false;
		document.removeEventListener(this.events[event], callback);
		return true;
	}
	getVersion() {
		return this.config.version;
	}
	getVersionNumber() {
		return this.config.versionNumber;
	}
}

module.exports = { Blockyfish };
