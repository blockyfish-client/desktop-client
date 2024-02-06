const { ipcRenderer } = require("electron");
const { setSettings, getSettings } = require("../store.js");

window.blockyfish = new (require("../blockyfish.js").Blockyfish)(window);
require("./events.js");

const brand_css = document.createElement("style");
document.querySelector("body").appendChild(brand_css);
brand_css.outerHTML = '<link rel="stylesheet" href="https://blockyfish.vercel.app/themes/branding.css">';

const custom_css = document.createElement("style");
document.querySelector("body").appendChild(custom_css);
custom_css.outerHTML = '<link id="customcss" rel="stylesheet" href="https://blockyfish.vercel.app/themes/reefpenguin/theme.css">';

const adblock_css = document.createElement("style");
document.querySelector("body").appendChild(adblock_css);
adblock_css.outerHTML = `
<style>
    .ad-block {
        display: none !important;
        opacity: 0 !important;
    }
    .home-page.width-1 .sidebar.left,
    .home-page.width-2 .sidebar.left {
        bottom: 0 !important;
    }
</style>
`;

setInterval(() => {
	if (document.querySelector(".ad-block")) {
		document.querySelectorAll(".ad-block").forEach((el) => {
			el.remove();
		});
	}
}, 100);

window.blockyfish.addEventListener("settings-open", () => {
	// Inject docassets toggle
	const docassets = document.querySelector("#pane-0 > form > div.el-form-item:nth-child(3)").cloneNode(true);
	docassets.setAttribute("id", "docassets-toggle");
	document.querySelector("#pane-0 > form").appendChild(docassets);
	document.querySelector("#docassets-toggle > div.el-form-item__label").innerText = "Docassets";
	document.querySelector("#docassets-toggle > div.el-form-item__content > span.notes").innerText = "Makes the game take on a different, more cartoony look";
	if (getSettings("docassets")) {
		document.querySelector("#docassets-toggle input.el-checkbox__original").checked = true;
		document.querySelector("#docassets-toggle label.el-checkbox").classList.add("is-checked");
		document.querySelector("#docassets-toggle span.el-checkbox__input").classList.add("is-checked");
	} else {
		document.querySelector("#docassets-toggle input.el-checkbox__original").checked = false;
		document.querySelector("#docassets-toggle label.el-checkbox").classList.remove("is-checked");
		document.querySelector("#docassets-toggle span.el-checkbox__input").classList.remove("is-checked");
	}
	document.querySelector("#docassets-toggle > div.el-form-item__content span.el-checkbox__inner").addEventListener("click", () => {
		setTimeout(() => {
			const enabled = document.querySelector("#docassets-toggle input.el-checkbox__original").checked;
			var c = document.querySelector("#docassets-toggle label.el-checkbox");
			var i = document.querySelector("#docassets-toggle span.el-checkbox__input");
			if (enabled) {
				c.classList.add("is-checked");
				i.classList.add("is-checked");
			} else {
				c.classList.remove("is-checked");
				i.classList.remove("is-checked");
			}
			setSettings("docassets", enabled);
			document.querySelector("#docassets-toggle input.el-checkbox__original").style.pointerEvents = "none";
			setTimeout(() => {
				ipcRenderer.send("restart-required");
				document.querySelector("#docassets-toggle input.el-checkbox__original").style.pointerEvents = "";
			}, 200);
		}, 10);
	});
});

window.blockyfish.addEventListener("settings-open", () => {
	// Inject API crash workaround toggle
	const acw = document.querySelector("#pane-0 > form > div.el-form-item:nth-child(3)").cloneNode(true);
	acw.setAttribute("id", "acw-toggle");
	document.querySelector("#pane-0 > form").appendChild(acw);
	document.querySelector("#acw-toggle > div.el-form-item__label").innerText = "API Crash Workaround";
	document.querySelector("#acw-toggle > div.el-form-item__content > span.notes").innerText =
		"Makes it so you can connect to servers even when the API is down. This will LIMIT most functionality of Blockyfish.";
	if (getSettings("apiCrashWorkaround")) {
		document.querySelector("#acw-toggle input.el-checkbox__original").checked = true;
		document.querySelector("#acw-toggle label.el-checkbox").classList.add("is-checked");
		document.querySelector("#acw-toggle span.el-checkbox__input").classList.add("is-checked");
	} else {
		document.querySelector("#acw-toggle input.el-checkbox__original").checked = false;
		document.querySelector("#acw-toggle label.el-checkbox").classList.remove("is-checked");
		document.querySelector("#acw-toggle span.el-checkbox__input").classList.remove("is-checked");
	}
	document.querySelector("#acw-toggle > div.el-form-item__content span.el-checkbox__inner").addEventListener("click", () => {
		setTimeout(() => {
			const enabled = document.querySelector("#acw-toggle input.el-checkbox__original").checked;
			var c = document.querySelector("#acw-toggle label.el-checkbox");
			var i = document.querySelector("#acw-toggle span.el-checkbox__input");
			if (enabled) {
				c.classList.add("is-checked");
				i.classList.add("is-checked");
			} else {
				c.classList.remove("is-checked");
				i.classList.remove("is-checked");
			}
			setSettings("apiCrashWorkaround", enabled);
			document.querySelector("#acw-toggle input.el-checkbox__original").style.pointerEvents = "none";
			setTimeout(() => {
				ipcRenderer.send("restart-required");
				document.querySelector("#acw-toggle input.el-checkbox__original").style.pointerEvents = "";
			}, 200);
		}, 10);
	});
});
