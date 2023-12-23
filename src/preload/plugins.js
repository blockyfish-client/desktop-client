const { app, shell } = require("@electron/remote");
const fs = require("fs");
const path = require("path");

const { setSettings, getSettings } = require("../store.js");

const plugins_css = document.createElement("style");
document.querySelector("body").appendChild(plugins_css);
plugins_css.id = "plugins-css";
plugins_css.innerHTML = `
.plugin-modal-box button {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	line-height: 1;
	height: 32px;
	min-width: 64px;
	white-space: nowrap;
	cursor: pointer;
	text-align: center;
	box-sizing: border-box;
	outline: 0;
	transition: 0.1s;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	vertical-align: middle;
	-webkit-appearance: none;
	min-height: 2.5rem;
	padding: 0.75rem 1.25rem;
	font-size: 0.875rem;
	outline: none;
	border: none;
	border-bottom: 4px solid;
	border-radius: 1rem;
	font-weight: 600;
}
.plugin-modal-box button.secondary {
	background-color: #0004;
	border: none !important;
}
.plugin-modal-box button.secondary:hover {
	background-color: #4b5563;
}
.plugin-modal-box button.primary {
	background-color: #0003;
	border: none !important;
}
.plugin-modal-box button.primary:hover {
	background-color: #059669;
}
.plugin-modal-box button {
	transition: all 0.3s;
}

.flex-row {
	display: flex;
	flex-direction: row;
}
.flex-column {
	display: flex;
	flex-direction: column;
}
.plugin-modal-bg {
    background-color: rgba(0,0,0,.2);
    backdrop-filter: blur(10px);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
}
.plugin-modal-box {
	background: #1f293766;
	border: none;
	border-radius: 0.75rem;
	padding: 8px 12px;
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    gap: 8px;
}
.plugin-modal-header {
	justify-content: center;
	align-items: center;
}
.plugin-modal-header p {
	margin: 0;
	font-size: 1.25em;
}
button.small-x {
	background: none;
	border: none;
	outline: none;
	cursor: pointer;
	padding: 0;
	top: 0;
    right: calc(-50% + 32px);
    position: relative;
	min-width: 16px;
	height: 16px;
	min-height: 16px;
}
.plugin-modal-content {
	display: flex;
	gap: 32px;
}
.plugin-list {
    height: 300px;
    width: calc(100vw - 200px);
	gap: 8px;
	overflow: auto;
    padding: 0 8px;
}
.plugin-item {
	background: #fff2;
	padding: 8px 12px;
	border-radius: 8px;
}
.plugin-modal-actions {
	display: flex;
	gap: 12px;
	justify-content: center;
	align-items: center;
	padding-top: 0.75rem;
}

.switch > input[type="checkbox"] {
	height: 0;
	width: 0;
	visibility: hidden;
}
.switch > label {
	cursor: pointer;
	text-indent: -9999px;
	width: 48px;
	height: 24px;
	background: #fff3;
	display: block;
	border-radius: 100px;
	position: relative;
	transition: all 0.2s;
	border: 1px solid #fff0;
}
.switch > label:after {
	content: "";
	position: absolute;
	top: 1px;
	left: 1px;
	width: 20px;
	height: 20px;
	background: #fff;
	border-radius: 90px;
	transition: all 0.2s;
}
.switch > input:checked + label {
	background: #409eff;
	border: 1px solid #409eff;
}
.switch > input:checked + label:after {
	left: calc(100% - 1px);
	transform: translateX(-100%);
}
`;

function createPluginBox(name, description, author, version, hasSettings) {
	var html = document.createElement("div");
	html.id = name.split(" ").join("_").toLowerCase();
	html.classList.add("plugin-item", "flex-row");
	html.style.justifyContent = "space-between";
	html.innerHTML = `
<div>
	<h2 style="font-size: large;">${name} <span style="font-size: small; color: #ccc;">${version}</span></h2>
	<p style="font-size: small; color: #ddd;">${description}<br>Made by ${author}</p>
</div>
<div>
	<div class="switch">
		<input
			type="checkbox"
			id="${name.split(" ").join("_").toLowerCase() + "_switch"}"
		/><label for="${name.split(" ").join("_").toLowerCase() + "_switch"}"></label>
	</div>
</div>
	`;
	return html;
}

function createPluginsModal() {
	var plugin_modal = document.createElement("div");
	plugin_modal.innerHTML = `
	<div class="plugin-modal-box flex-column">
		<div class="plugin-modal-header flex-row">
			<p id="title">Plugins</p>
			<button class="plugin-modal-close small-x flex-row">
				<svg width="1.125em" height="1.125em" viewBox="0 0 24 24" fill="gray">
					<path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
				</svg>
			</button>
		</div>
		<div class="plugin-modal-content">
			<div class="plugin-list flex-column">
				
			</div>
		</div>
		<div class="plugin-modal-actions">
			<button class="secondary plugin-modal-close">Close</button>
			<button class="primary plugin-folder-open">Open plugins folder</button>
		</div>
	</div>
	`;
	plugin_modal.classList.add("plugin-modal-bg", "flex-column");
	document.querySelector("body").appendChild(plugin_modal);

	document.querySelectorAll(".plugin-modal-box .plugin-modal-close").forEach((el) => {
		el.addEventListener("click", () => {
			plugin_modal.remove();
		});
	});

	document.querySelectorAll(".plugin-modal-box .plugin-folder-open").forEach((el) => {
		el.addEventListener("click", () => {
			shell.openPath(path.join(app.getPath("userData"), "plugins"));
		});
	});
}
// createPluginsModal();

const plugin_button_clone = document.querySelector("div.p-2.sidebar.right.space-y-2 > div.container > div > div").cloneNode(true);
document.querySelector("div.p-2.sidebar.right.space-y-2 > div.container > div").appendChild(plugin_button_clone);
const plugin_button = plugin_button_clone.firstElementChild;
plugin_button.classList.remove("pink");
plugin_button.classList.add("orange", "plugin", "plugin-close");
const pluginText = document.querySelector("button.plugin > span:nth-child(1) > span:nth-child(2)");
pluginText.innerHTML = "Plugins";
const pluginIcon = document.querySelector("button.plugin > span:nth-child(1) > svg:nth-child(1)");

pluginIcon.innerHTML = `<path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0Zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708ZM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11Z"/>`;
pluginIcon.setAttribute("viewBox", "-4 -4 24 24");
pluginIcon.setAttribute("fill", "currentColor");

(async () => {
	window.loadedPlugins = new Set();
	window.allPlugins = new Set();
	window.plugins = await getPlugins();

	window.plugins.forEach((plugin) => {
		try {
			const module = require(path.join(app.getPath("userData"), "plugins", plugin));
			console.log(module);
			if (window.loadedPlugins.has(module)) {
				return;
			} else if (getSettings("plugins." + module.name.split(" ").join("_").toLowerCase() + ".enabled")) {
				window.loadedPlugins.add(module);
				window.allPlugins.add(module);
			} else {
				window.allPlugins.add(module);
			}
		} catch {}
	});
})();

plugin_button.addEventListener("click", async () => {
	createPluginsModal();

	window.allPlugins.forEach((plugin) => {
		try {
			document.querySelector(".plugin-list").appendChild(createPluginBox(plugin.name, plugin.description, plugin.author, plugin.version));
			var ts = document.querySelector(`.plugin-list input#${plugin.name.split(" ").join("_").toLowerCase() + "_switch"}[type="checkbox"]`);
			if (getSettings("plugins." + plugin.name.split(" ").join("_").toLowerCase() + ".enabled")) {
				ts.setAttribute("checked", null);
			} else {
				ts.removeAttribute("checked");
			}
			ts.addEventListener("change", (e) => {
				setSettings("plugins." + plugin.name.split(" ").join("_").toLowerCase() + ".enabled", e.target.checked);
			});
		} catch {}
	});
});

function getPlugins() {
	return new Promise((resolve) => {
		if (!fs.existsSync(path.join(app.getPath("userData"), "plugins"))) fs.mkdirSync(path.join(app.getPath("userData"), "plugins"));
		var plugins = fs.readdirSync(path.join(app.getPath("userData"), "plugins"), {
			encoding: "utf8"
		});
		plugins = plugins.filter((plugin) => plugin.endsWith(".js"));
		plugins = plugins.filter((plugin) => {
			const module = require(path.join(app.getPath("userData"), "plugins", plugin));
			try {
				if (module.name && module.version && module.description && module.author && module.scripts) return true;
			} catch {
				return false;
			}
		});
		resolve(plugins);
	});
}
