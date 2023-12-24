const { app, shell } = require("@electron/remote");
const fs = require("fs");
const path = require("path");

const config = require("../../config.json");

const { setSettings, getSettings } = require("../store.js");
const { ipcRenderer } = require("electron");

var modified = false;

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
	align-items: center;
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

.switch {
	translate: 0 -8px;
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
.plugin-action-button {
	width: 36px !important;
	height: 36px !important;
	min-width: 36px !important;
	min-height: 36px !important;
	border: none !important;
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
	padding: 0 !important;
	background: #fff3 !important;
	border-radius: 8px !important;
}
.plugin-action-button.download:hover {
	background: #409eff !important;
}
.plugin-action-button.update:hover {
	background: #059669 !important;
}
.plugin-action-button.delete:hover {
	background: #dc2626 !important;
}
`;

function createPluginBox(name, description, author, version, hasSettings, online, updatable) {
	var html = document.createElement("div");
	html.id = name.split(" ").join("_").toLowerCase();
	html.classList.add("plugin-item", "flex-row");
	html.style.justifyContent = "space-between";

	// For installed plugins
	// Update button
	const ub = `<button id="${name.split(" ").join("_").toLowerCase() + "_update_button"}" class="plugin-action-button update">
	<svg style="pointer-events: none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
		<path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
		<path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
	</svg>
</button>`;
	const sw = `${updatable ? ub : ""}
<button id="${name.split(" ").join("_").toLowerCase() + "_delete_button"}" class="plugin-action-button delete">
	<svg style="pointer-events: none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
		<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
		<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
	</svg>
</button>
	<div class="switch" style="margin-left: 0.5rem;">
		<input
			type="checkbox"
			id="${name.split(" ").join("_").toLowerCase() + "_switch"}"
		/><label for="${name.split(" ").join("_").toLowerCase() + "_switch"}"></label>
	</div>`;

	// For online plugins
	const db = `<button id="${name.split(" ").join("_").toLowerCase() + "_download_button"}" class="plugin-action-button download">
	<svg style="pointer-events: none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
		<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
		<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
	</svg>
</button>`;
	html.innerHTML = `
<div>
	<h2 style="font-size: large;">${name} <span style="font-size: small; color: #ccc;">${version}</span></h2>
	<p style="font-size: small; color: #ddd;">${description}<br>Made by ${author}</p>
</div>
<div style="display: flex; flex-direction: row; gap: 0.5rem; align-items: center">
	${online ? db : sw}
</div>
	`;
	return html;
}

function createPluginsModal() {
	var plugin_modal = document.createElement("div");
	plugin_modal.innerHTML = `
	<div class="plugin-modal-box flex-column">
		<div class="plugin-modal-header flex-row">
			<p id="title">Plu<span class="plugin-folder-open">g</span>ins</p>
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
		</div>
	</div>
	`;
	plugin_modal.classList.add("plugin-modal-bg", "flex-column");
	document.querySelector("body").appendChild(plugin_modal);

	document.querySelectorAll(".plugin-modal-box .plugin-modal-close").forEach((el) => {
		el.addEventListener("click", () => {
			if (modified) ipcRenderer.send("restart-required");
			plugin_modal.remove();
		});
	});

	document.querySelectorAll(".plugin-modal-box .plugin-folder-open").forEach((el) => {
		el.addEventListener("click", () => {
			ipcRenderer.send("open-plugins-folder");
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
	window.onlinePlugins = new Set();
	window.updatablePlugins = new Set();
	window.plugins = await getPlugins();
	window.remotePlugins = await getRemotePlugins();

	window.plugins.forEach((plugin) => {
		try {
			const module = require(path.join(app.getPath("userData"), "plugins", plugin));
			module.fn = plugin;
			if (window.loadedPlugins.has(module)) {
				return;
			} else if (getSettings("plugins." + module.name.split(" ").join("_").toLowerCase() + ".enabled")) {
				module.script();
				window.loadedPlugins.add(module);
				window.allPlugins.add(module);
			} else {
				window.allPlugins.add(module);
			}
		} catch {}
	});
	var installedPlugins = [];
	window.allPlugins.forEach((plugin) => {
		installedPlugins.push({
			id: plugin.id,
			version: plugin.versionNumber
		});
	});
	window.remotePlugins.forEach((plugin) => {
		try {
			if (!installedPlugins.find((p) => p.id == plugin.id)) {
				window.onlinePlugins.add(plugin);
			} else if (installedPlugins.find((p) => p.id == plugin.id && p.version < plugin.versionNumber)) {
				window.updatablePlugins.add(plugin.id);
			}
		} catch {}
	});
	window.blockyfish.emit("plugins-load");
})();

plugin_button.addEventListener("click", async () => {
	createPluginsModal();
	renderPluginList();
});

function renderPluginList() {
	document.querySelector(".plugin-list").innerHTML = "";
	window.allPlugins.forEach((plugin) => {
		try {
			var updatable = window.updatablePlugins.has(plugin.id);
			document.querySelector(".plugin-list").appendChild(createPluginBox(plugin.name, plugin.description, plugin.author, plugin.version, false, false, updatable));
			var ts = document.querySelector(`.plugin-list input#${plugin.name.split(" ").join("_").toLowerCase() + "_switch"}[type="checkbox"]`);
			if (getSettings("plugins." + plugin.name.split(" ").join("_").toLowerCase() + ".enabled")) {
				ts.setAttribute("checked", null);
			} else {
				ts.removeAttribute("checked");
			}
			ts.addEventListener("change", (e) => {
				modified = true;
				setSettings("plugins." + plugin.name.split(" ").join("_").toLowerCase() + ".enabled", e.target.checked);
			});
			var rb = document.querySelector(`.plugin-list button#${plugin.name.split(" ").join("_").toLowerCase() + "_delete_button"}`);
			rb.addEventListener("click", async (e) => {
				modified = true;
				if (!plugin.fn) {
					try {
						var temp_fn = "";
						window.remotePlugins.forEach((e) => {
							console.log(e.name);
							if (e.name == plugin.name) temp_fn = e.url.split("/").pop();
						});
						if (temp_fn != "") {
							plugin.fn = temp_fn;
						}
					} catch {}
				}
				await deletePlugin(plugin.fn);
				window.allPlugins.delete(plugin);
				window.onlinePlugins.add(plugin);
				renderPluginList();
			});
			if (updatable) {
				var ub = document.querySelector(`.plugin-list button#${plugin.name.split(" ").join("_").toLowerCase() + "_update_button"}`);
				ub.addEventListener("click", async (e) => {
					modified = true;
					if (!plugin.url) {
						try {
							var temp_url = "";
							window.remotePlugins.forEach((e) => {
								if (e.name == plugin.name) temp_url = e.url;
							});
							if (temp_url != "") {
								plugin.url = temp_url;
							}
						} catch {}
					}
					await downloadPlugin(`${config.remoteEndpoint}/plugins${plugin.url}`);
					window.updatablePlugins.delete(plugin.id);
					renderPluginList();
				});
			}
		} catch {}
	});
	window.onlinePlugins.forEach((plugin) => {
		try {
			document.querySelector(".plugin-list").appendChild(createPluginBox(plugin.name, plugin.description, plugin.author, plugin.version, false, true, false));
			var db = document.querySelector(`.plugin-list button#${plugin.name.split(" ").join("_").toLowerCase() + "_download_button"}`);
			db.addEventListener("click", async (e) => {
				modified = true;
				if (!plugin.url) {
					try {
						var temp_url = "";
						window.remotePlugins.forEach((e) => {
							if (e.name == plugin.name) temp_url = e.url;
						});
						if (temp_url != "") {
							plugin.url = temp_url;
						}
					} catch {}
				}
				await downloadPlugin(`${config.remoteEndpoint}/plugins${plugin.url}`);
				window.onlinePlugins.delete(plugin);
				window.allPlugins.add(plugin);
				renderPluginList();
			});
		} catch {}
	});
}

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
				return !!(module.name && typeof module.id != undefined && module.author && module.version && module.versionNumber && module.description && module.script);
			} catch {
				return false;
			}
		});
		resolve(plugins);
	});
}

function getRemotePlugins() {
	return new Promise((resolve) => {
		fetch(`${config.remoteEndpoint}/plugins/plugins.json`)
			.then((r) => resolve(r.json()))
			.catch(() => resolve([]));
	});
}

function downloadPlugin(url) {
	return new Promise(async (resolve) => {
		plugin = await (await fetch(url)).text();
		const fn = url.split("/").pop();
		fs.writeFileSync(path.join(app.getPath("userData"), "plugins", fn), plugin);
		resolve(plugin);
	});
}

function deletePlugin(fn) {
	return new Promise((resolve) => {
		fs.rmSync(path.join(app.getPath("userData"), "plugins", fn));
		resolve();
	});
}
