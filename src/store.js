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
		},
		apiCrashWorkaround: {
			type: "boolean",
			default: false
		},
		plugins: {
			type: "object",
			patternProperties: {
				".*": {
					type: "object",
					properties: {
						enabled: {
							type: "boolean",
							default: true
						},
						settings: {
							type: "object"
						}
					}
				}
			}
		}
	},
	clearInvalidConfig: true
});

function getSettings(key) {
	return store.get(key);
}
function setSettings(key, value) {
	return store.set(key, value);
}

module.exports = { getSettings, setSettings };
