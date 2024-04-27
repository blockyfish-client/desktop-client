const { ipcRenderer } = require("electron");
const { setSettings, getSettings } = require("../store.js");

window.blockyfish = new (require("../blockyfish.js").Blockyfish)(window);
require("./events.js");

const brand_css = document.createElement("style");
document.querySelector("body").appendChild(brand_css);
brand_css.outerHTML =
	'<link rel="stylesheet" href="https://blockyfish.vercel.app/themes/branding.css">';

const custom_css = document.createElement("style");
document.querySelector("body").appendChild(custom_css);
custom_css.outerHTML =
	'<link id="customcss" rel="stylesheet" href="https://blockyfish.vercel.app/themes/reefpenguin/theme.css">';

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
	// Inject Vsync toggle
	// Adapted from docassets toggle logic
	const Vsync = document
		.querySelector("#pane-0 > form > div.el-form-item:nth-child(3)")
		.cloneNode(true);
	Vsync.setAttribute("id", "Vsync-toggle");
	document.querySelector("#pane-0 > form").appendChild(Vsync);
	document.querySelector(
		"#Vsync-toggle > div.el-form-item__label"
	).innerText = "Vsync";
	document.querySelector(
		"#Vsync-toggle > div.el-form-item__content > span.notes"
	).innerText =
		"Disabling it may cause screen tearing but can reduce input lag";
	if (getSettings("Vsync")) {
		document.querySelector(
			"#Vsync-toggle input.el-checkbox__original"
		).checked = true;
		document
			.querySelector("#Vsync-toggle label.el-checkbox")
			.classList.add("is-checked");
		document
			.querySelector("#Vsync-toggle span.el-checkbox__input")
			.classList.add("is-checked");
	} else {
		document.querySelector(
			"#Vsync-toggle input.el-checkbox__original"
		).checked = false;
		document
			.querySelector("#Vsync-toggle label.el-checkbox")
			.classList.remove("is-checked");
		document
			.querySelector("#Vsync-toggle span.el-checkbox__input")
			.classList.remove("is-checked");
	}
	document
		.querySelector(
			"#Vsync-toggle > div.el-form-item__content span.el-checkbox__inner"
		)
		.addEventListener("click", () => {
			setTimeout(() => {
				const enabled = document.querySelector(
					"#Vsync-toggle input.el-checkbox__original"
				).checked;
				var c = document.querySelector(
					"#Vsync-toggle label.el-checkbox"
				);
				var i = document.querySelector(
					"#Vsync-toggle span.el-checkbox__input"
				);
				if (enabled) {
					c.classList.add("is-checked");
					i.classList.add("is-checked");
				} else {
					c.classList.remove("is-checked");
					i.classList.remove("is-checked");
				}
				setSettings("Vsync", enabled);
				document.querySelector(
					"#Vsync-toggle input.el-checkbox__original"
				).style.pointerEvents = "none";
				setTimeout(() => {
					ipcRenderer.send("restart-required");
					document.querySelector(
						"#Vsync-toggle input.el-checkbox__original"
					).style.pointerEvents = "";
				}, 200);
			}, 10);
		});
});

window.blockyfish.addEventListener("settings-open", () => {
	// Inject docassets toggle
	const docassets = document
		.querySelector("#pane-0 > form > div.el-form-item:nth-child(3)")
		.cloneNode(true);
	docassets.setAttribute("id", "docassets-toggle");
	document.querySelector("#pane-0 > form").appendChild(docassets);
	document.querySelector(
		"#docassets-toggle > div.el-form-item__label"
	).innerText = "Docassets";
	document.querySelector(
		"#docassets-toggle > div.el-form-item__content > span.notes"
	).innerText = "Makes the game take on a different, more cartoony look";
	if (getSettings("docassets")) {
		document.querySelector(
			"#docassets-toggle input.el-checkbox__original"
		).checked = true;
		document
			.querySelector("#docassets-toggle label.el-checkbox")
			.classList.add("is-checked");
		document
			.querySelector("#docassets-toggle span.el-checkbox__input")
			.classList.add("is-checked");
	} else {
		document.querySelector(
			"#docassets-toggle input.el-checkbox__original"
		).checked = false;
		document
			.querySelector("#docassets-toggle label.el-checkbox")
			.classList.remove("is-checked");
		document
			.querySelector("#docassets-toggle span.el-checkbox__input")
			.classList.remove("is-checked");
	}
	document
		.querySelector(
			"#docassets-toggle > div.el-form-item__content span.el-checkbox__inner"
		)
		.addEventListener("click", () => {
			setTimeout(() => {
				const enabled = document.querySelector(
					"#docassets-toggle input.el-checkbox__original"
				).checked;
				var c = document.querySelector(
					"#docassets-toggle label.el-checkbox"
				);
				var i = document.querySelector(
					"#docassets-toggle span.el-checkbox__input"
				);
				if (enabled) {
					c.classList.add("is-checked");
					i.classList.add("is-checked");
				} else {
					c.classList.remove("is-checked");
					i.classList.remove("is-checked");
				}
				setSettings("docassets", enabled);
				document.querySelector(
					"#docassets-toggle input.el-checkbox__original"
				).style.pointerEvents = "none";
				setTimeout(() => {
					ipcRenderer.send("restart-required");
					document.querySelector(
						"#docassets-toggle input.el-checkbox__original"
					).style.pointerEvents = "";
				}, 200);
			}, 10);
		});
});

window.blockyfish.addEventListener("settings-open", () => {
	// Inject API crash workaround toggle
	const acw = document
		.querySelector("#pane-0 > form > div.el-form-item:nth-child(3)")
		.cloneNode(true);
	acw.setAttribute("id", "acw-toggle");
	document.querySelector("#pane-0 > form").appendChild(acw);
	document.querySelector("#acw-toggle > div.el-form-item__label").innerText =
		"API Crash Workaround";
	document.querySelector(
		"#acw-toggle > div.el-form-item__content > span.notes"
	).innerText =
		"Makes it so you can connect to servers even when the API is down. This will LIMIT most functionality of Blockyfish.";
	if (getSettings("apiCrashWorkaround")) {
		document.querySelector(
			"#acw-toggle input.el-checkbox__original"
		).checked = true;
		document
			.querySelector("#acw-toggle label.el-checkbox")
			.classList.add("is-checked");
		document
			.querySelector("#acw-toggle span.el-checkbox__input")
			.classList.add("is-checked");
	} else {
		document.querySelector(
			"#acw-toggle input.el-checkbox__original"
		).checked = false;
		document
			.querySelector("#acw-toggle label.el-checkbox")
			.classList.remove("is-checked");
		document
			.querySelector("#acw-toggle span.el-checkbox__input")
			.classList.remove("is-checked");
	}
	document
		.querySelector(
			"#acw-toggle > div.el-form-item__content span.el-checkbox__inner"
		)
		.addEventListener("click", () => {
			setTimeout(() => {
				const enabled = document.querySelector(
					"#acw-toggle input.el-checkbox__original"
				).checked;
				var c = document.querySelector("#acw-toggle label.el-checkbox");
				var i = document.querySelector(
					"#acw-toggle span.el-checkbox__input"
				);
				if (enabled) {
					c.classList.add("is-checked");
					i.classList.add("is-checked");
				} else {
					c.classList.remove("is-checked");
					i.classList.remove("is-checked");
				}
				setSettings("apiCrashWorkaround", enabled);
				document.querySelector(
					"#acw-toggle input.el-checkbox__original"
				).style.pointerEvents = "none";
				setTimeout(() => {
					ipcRenderer.send("restart-required");
					document.querySelector(
						"#acw-toggle input.el-checkbox__original"
					).style.pointerEvents = "";
				}, 200);
			}, 10);
		});

	// Inject API crash workaround toggle for hosts only mode
	const acwho = document
		.querySelector("#pane-0 > form > div.el-form-item:nth-child(3)")
		.cloneNode(true);
	acwho.setAttribute("id", "acwho-toggle");
	document.querySelector("#pane-0 > form").appendChild(acwho);
	document.querySelector(
		"#acwho-toggle > div.el-form-item__label"
	).innerText = "Only spoof hosts API";
	document.querySelector(
		"#acwho-toggle > div.el-form-item__content > span.notes"
	).innerText =
		"Only spoof the hosts API, this will allow you to sign-in to your account and use most features.";
	if (getSettings("apiCrashWorkaroundHostOnly")) {
		document.querySelector(
			"#acwho-toggle input.el-checkbox__original"
		).checked = true;
		document
			.querySelector("#acwho-toggle label.el-checkbox")
			.classList.add("is-checked");
		document
			.querySelector("#acwho-toggle span.el-checkbox__input")
			.classList.add("is-checked");
	} else {
		document.querySelector(
			"#acwho-toggle input.el-checkbox__original"
		).checked = false;
		document
			.querySelector("#acwho-toggle label.el-checkbox")
			.classList.remove("is-checked");
		document
			.querySelector("#acwho-toggle span.el-checkbox__input")
			.classList.remove("is-checked");
	}
	document
		.querySelector(
			"#acwho-toggle > div.el-form-item__content span.el-checkbox__inner"
		)
		.addEventListener("click", () => {
			setTimeout(() => {
				const enabled = document.querySelector(
					"#acwho-toggle input.el-checkbox__original"
				).checked;
				var c = document.querySelector(
					"#acwho-toggle label.el-checkbox"
				);
				var i = document.querySelector(
					"#acwho-toggle span.el-checkbox__input"
				);
				if (enabled) {
					c.classList.add("is-checked");
					i.classList.add("is-checked");
				} else {
					c.classList.remove("is-checked");
					i.classList.remove("is-checked");
				}
				setSettings("apiCrashWorkaroundHostOnly", enabled);
				document.querySelector(
					"#acwho-toggle input.el-checkbox__original"
				).style.pointerEvents = "none";
				setTimeout(() => {
					ipcRenderer.send("restart-required");
					document.querySelector(
						"#acwho-toggle input.el-checkbox__original"
					).style.pointerEvents = "";
				}, 200);
			}, 10);
		});
});

window.blockyfish.addEventListener("signin-open", () => {
	// add clear cookies button
	const signinModal = document.querySelector(
		"#app div.modal-container div.modal__action > #routeModalActions"
	);
	const clearCookiesButton = document.createElement("button");
	clearCookiesButton.classList.add("clear-cookies-button");
	const clearCookiesCss = document.createElement("style");
	clearCookiesCss.innerHTML = `
    .clear-cookies-button {
        padding: 5px 10px;
        background: #0003;
        border-radius: 8px;
        width: calc(100% - 16px);
        margin: 8px 8px 4px 8px;
        transition: 0.3s;
    }
    .clear-cookies-button:hover {
        background: #dc2626;
    }
    `;
	document.head.appendChild(clearCookiesCss);
	clearCookiesButton.innerText = "Clear cookies";
	clearCookiesButton.addEventListener("click", () => {
		ipcRenderer.send("clear-cookies");
	});
	signinModal.appendChild(clearCookiesButton);
});
