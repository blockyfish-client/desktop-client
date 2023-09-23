const Store = require("electron-store");
const store = new Store({
	schema: {
		docassets: {
			type: "boolean",
			default: false
		},
		adblock: {
			type: "boolean",
			default: true
		}
	}
});

function getSettings(key) {
	return store.get(key);
}
function setSettings(key) {
	return store.set(key);
}

module.exports = { getSettings, setSettings };
