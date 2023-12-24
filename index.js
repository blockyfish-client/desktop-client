const { BrowserWindow, app, shell, ipcMain, session, Menu, dialog } = require("electron");
const path = require("path");
require("@electron/remote/main").initialize();
const os = require("os");
const platform = os.platform();

const { getSettings, setSettings } = require("./src/store.js");

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	app.quit();
}

app.commandLine.appendSwitch("lang", "en-US");

if (process.defaultApp) {
	if (process.argv.length >= 2) {
		app.setAsDefaultProtocolClient("deeeepio", process.execPath, [path.resolve(process.argv[1])]);
	}
} else {
	app.setAsDefaultProtocolClient("deeeepio");
}

const debug = app.commandLine.getSwitchValue("testing");

var modal;
function createModal(title, text, img, themed, onConfirm) {
	modal = new BrowserWindow({
		width: 530,
		height: 250,
		resizable: false,
		frame: false,
		icon: platform == "darwin" ? path.join(__dirname, "icons", "icon.icns") : path.join(__dirname, "icons", "128x128.png"),
		transparent: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			sandbox: false
		},
		parent: win,
		modal: true
	});
	require("@electron/remote/main").enable(modal.webContents);

	var modalUrl = path.join(__dirname, "src", "modal.html");
	var titleUri, textUri, imgUri, themedUri;
	var params = [];
	if (title) {
		titleUri = `title=${encodeURI(title)}`;
	}
	if (text) {
		textUri = `content=${encodeURI(text)}`;
	}
	if (img) {
		imgUri = `img=${encodeURI(img)}`;
	}
	if (themed) {
		themedUri = `themed=${encodeURI(themed)}`;
	}
	params.push(titleUri, textUri, imgUri, themedUri);
	modalUrl += "?" + params.join("&");
	modal.loadURL(modalUrl);
	ipcMain.on("cancel", () => {
		if (modal != null) {
			modal.destroy();
			modal = null;
		}
	});
	ipcMain.on("confirm", () => {
		if (modal != null) {
			modal.destroy();
			modal = null;
		}
		onConfirm();
	});
}

var loadingWin;
var loadTimer;
function loadingWindow() {
	loadingWin = new BrowserWindow({
		width: 930,
		height: 480,
		resizable: false,
		frame: false,
		show: false,
		icon: platform == "darwin" ? path.join(__dirname, "icons", "icon.icns") : path.join(__dirname, "icons", "128x128.png"),
		alwaysOnTop: true,
		transparent: true
	});
	loadingWin.loadFile(path.join(__dirname, "src", "loading.html"));
	loadingWin.show();
	loadTimer = Date.now() + 8000; // 8 seconds from now;
}

var win;
function createWindow() {
	if (debug != "true") loadingWindow();
	win = new BrowserWindow({
		width: 1200,
		height: 810,
		minWidth: 960,
		minHeight: 680,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: false,
			enableRemoteModule: true,
			// devTools: false,
			preload: path.join(__dirname, "src", "preload", "preload.js"),
			sandbox: false
		},
		titleBarStyle: "hidden",
		icon: platform == "darwin" ? path.join(__dirname, "icons", "icon.icns") : path.join(__dirname, "icons", "128x128.png"),
		show: false
	});

	require("@electron/remote/main").enable(win.webContents);

	win.loadURL("https://deeeep.io");

	win.setMenu(null);
	Menu.setApplicationMenu(null);

	if (debug == "true") win.webContents.openDevTools();

	win.webContents.setBackgroundThrottling(false);

	win.webContents.on("did-finish-load", () => {
		if (debug != "true") {
			if (Date.now() > loadTimer) {
				loadingWin.webContents.executeJavaScript(`
				document.body.classList.add("done")
				`);
				setTimeout(() => {
					loadingWin.close();
					win.show();
					win.focus();
				}, 500);
			} else {
				setTimeout(() => {
					loadingWin.webContents.executeJavaScript(`
					document.body.classList.add("done")
					`);
					setTimeout(() => {
						loadingWin.close();
						win.show();
						win.focus();
					}, 500);
				}, loadTimer - Date.now());
			}
		} else {
			win.show();
			win.focus();
		}
	});

	ipcMain.on("close", () => {
		createModal("Leave Blockyfish", "Are you sure you want to exit Blockyfish", "../icons/64x64.png", true, () => {
			win.close();
		});
	});

	ipcMain.on("restart-required", () => {
		createModal("Restart Required", "Please restart Blockyfish to apply changes", "../icons/64x64.png", true, () => {
			app.relaunch();
			app.exit();
		});
	});

	registerRedirects();
	registerExternalLinkHandler();
}

app.on("second-instance", (event, commandLine) => {
	if (win) {
		if (win.isMinimized()) win.restore();
		win.focus();
	}
	// windows deeplink handling
	// console.log(commandLine.pop().slice(0, -1));
	// dialog.showErrorBox("Welcome Back", commandLine.pop().slice(0, -1));
});

// darwin & linux deeplink handling
app.on("open-url", (_event, url) => {
	console.log(url);
	dialog.showErrorBox("Welcome Back", url);
});

app.on("ready", () => {
	createWindow();
});

app.on("window-all-closed", () => {
	app.quit();
});
app.on("activate", () => {
	if (win == null) createWindow();
});

function registerRedirects() {
	const { genericRedirectHandler } = require("./src/redirect.js");
	const { default: enhanceWebRequest } = require("electron-better-web-request");

	var enhancedSession = enhanceWebRequest(session.defaultSession);

	if (getSettings("docassets")) {
		// Animations
		enhancedSession.webRequest.onBeforeRequest(
			{
				urls: ["*://*.deeeep.io/assets/animations/*"],
				types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
			},
			genericRedirectHandler(/https?:\/\/((beta|mapmaker|cdn)\.)?deeeep\.io\/assets\/animations/, "https://the-doctorpus.github.io/doc-assets/images/default/animations", false)
		);

		// Animals
		enhancedSession.webRequest.onBeforeRequest(
			{
				urls: ["*://*.deeeep.io/assets/characters/*"],
				types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
			},
			genericRedirectHandler(/https?:\/\/((beta|mapmaker|cdn)\.)?deeeep\.io\/assets\/characters/, "https://the-doctorpus.github.io/doc-assets/images/characters", false)
		);

		// Spritesheet
		enhancedSession.webRequest.onBeforeRequest(
			{
				urls: ["*://*.deeeep.io/assets/spritesheets/*"],
				types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
			},
			genericRedirectHandler(/https?:\/\/((beta|mapmaker|cdn)\.)?deeeep\.io\/assets\/spritesheets/, "https://the-doctorpus.github.io/doc-assets/images/default/spritesheets", false)
		);

		// Map spritesheet
		enhancedSession.webRequest.onBeforeRequest(
			{
				urls: ["*://*.deeeep.io/assets/packs/*"],
				types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
			},
			genericRedirectHandler(/https?:\/\/((beta|mapmaker|cdn)\.)?deeeep\.io\/assets\/packs/, "https://the-doctorpus.github.io/doc-assets/images/default/mapmaker-asset-packs", false)
		);

		// Misc image assets
		enhancedSession.webRequest.onBeforeRequest(
			{
				urls: ["*://*.deeeep.io/img/*"],
				types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
			},
			genericRedirectHandler(/https?:\/\/((beta|mapmaker|cdn)\.)?deeeep\.io\/img/, "https://the-doctorpus.github.io/doc-assets/images/img", false)
		);

		// Pets
		enhancedSession.webRequest.onBeforeRequest(
			{
				urls: ["*://*.deeeep.io/custom/pets/*"],
				types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
			},
			genericRedirectHandler(/https?:\/\/((beta|mapmaker|cdn)\.)?deeeep\.io\/custom\/pets/, "https://the-doctorpus.github.io/doc-assets/images/custom/pets", false)
		);

		// Skins
		enhancedSession.webRequest.onBeforeRequest(
			{
				urls: ["*://*.deeeep.io/assets/skins/*"],
				types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
			},
			genericRedirectHandler(/https?:\/\/((beta|mapmaker|cdn)\.)?deeeep\.io\/assets\/skins/, "https://the-doctorpus.github.io/doc-assets/images/skans", false)
		);

		// Custom skins (from Creators Center)
		enhancedSession.webRequest.onBeforeRequest(
			{
				urls: ["*://cdn.deeeep.io/custom/skins/*"],
				types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
			},
			genericRedirectHandler(/https?:\/\/cdn\.deeeep\.io\/custom\/skins/, "https://the-doctorpus.github.io/doc-assets/images/skans/custom", "skin")
		);
	}

	if (getSettings("adblock")) {
		// Adblock
		enhancedSession.webRequest.onBeforeRequest(
			{
				urls: [
					"*://*.doubleclick.net/*",
					"*://*.googlesyndication.com/*",
					"*://adservice.google.com/*",
					"*://*.googleadservices.com/*",
					"*://app-measurement.com/*",
					"*://analytics.google.com/*",
					"*://*.googleanalytics.com/*",
					"*://google-analytics.com/*",
					"*://*.google-analytics.com/*",
					"*://*.googletagmanager.com/*",
					"*://*.googleapis.com/*"
				]
			},
			(_details, callback) => {
				callback({
					cancel: true
				});
			}
		);
	}
}

function registerExternalLinkHandler() {
	const allowedUrls = ["https://beta.deeeep.io", "https://deeeep.io", "https://www.facebook.com/v13.0/dialog/oauth", "https://accounts.google.com/o/oauth2", "https://oauth.vk.com/authorize"];
	win.webContents.setWindowOpenHandler(({ url }) => {
		var allow = false;
		allowedUrls.forEach((value) => {
			if (url.startsWith(value)) allow = true;
		});
		if (!allow) {
			shell.openExternal(url);
			return { action: "deny" };
		} else {
			return {
				action: "allow",
				overrideBrowserWindowOptions: {
					icon: platform == "darwin" ? path.join(__dirname, "icons", "icon.icns") : path.join(__dirname, "icons", "128x128.png")
				}
			};
		}
	});
}
