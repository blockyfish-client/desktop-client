class Blockyfish {
	constructor(window) {
		this.window = window;
		this.events = {
			first_play: new Event("first-play", { bubbles: true, cancelable: false }),
			map_load: new Event("map-load", { bubbles: true, cancelable: false }),
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
