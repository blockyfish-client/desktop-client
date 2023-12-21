window.addEventListener("load", () => {
	window.bfi = require("../../info.json");
	require("./titlebar.js");
	require("./branding.js");
	require("../store.js");
	require("./plugins.js");
});

window.addEventListener("DOMContentLoaded", () => {
	require("./blockyfishnews.js");
});
